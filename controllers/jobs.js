const connectDB = require("../db/connect");
const { BadRequestError } = require("../errors");
const NotFoundError = require("../errors/not-found");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID });
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

exports.createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

exports.getJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
  } = req;

  const job = await Job.findOne({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new NotFoundError(`Job not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

exports.updateJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
    body: { company, position },
  } = req;

  if (!company?.trim() || !position?.trim()) {
    throw new BadRequestError("Please provide input to be updated");
  }

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedJob) {
    throw new NotFoundError(`Job not found`);
  }
  res.status(StatusCodes.OK).json({ updated: "successful", job: updatedJob });
};

exports.deleteJob = async (req, res) => {
  const {
    params: { id: jobID },
    user: { userID },
  } = req;

  const deletedJob = await Job.findOneAndRemove({
    _id: jobID,
    createdBy: userID,
  });
  if (!deletedJob) {
    throw new NotFoundError(`Job not found`);
  }
  res.status(StatusCodes.OK).send();
};
