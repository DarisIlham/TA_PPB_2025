import Activity from "../models/activity.model.js";

export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};