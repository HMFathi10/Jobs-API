const express = require("express");
const Router = express.Router();
const { getAllJobs, getJob, createJob, updateJob, deletejob } = require("../controllers/jobs");


Router.route("/").post(createJob).get(getAllJobs);
Router.route("/:id").get(getJob).patch(updateJob).delete(deletejob);


module.exports = Router;


