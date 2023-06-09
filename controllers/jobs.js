// const User = require("../models/User");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

const getAllJobs = async (req, res) => {
    const Jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
    res.status(StatusCodes.OK).json({ Jobs, count: Jobs.length });
}
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req; // id: jobId ????
    const job = await Job.findOne({ createdBy: userId, _id: jobId }).sort("createdAt");
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}
const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req;
    if (company === '' && position === '') {
        throw new BadRequestError("Company or Position fields cannot be empty.");
    }
    const job = await Job.findOneAndUpdate({ createdBy: userId, _id: jobId }, req.body, { new: true, runValidators: true, useFindAndModify: false });
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
}
const deletejob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOneAndRemove({ createdBy: userId, _id: jobId });
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deletejob };