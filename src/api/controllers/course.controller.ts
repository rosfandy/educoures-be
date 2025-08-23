import { Request, Response } from "express";
import { Course, CourseCategory } from "../../models";
import { Op } from "sequelize";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { category_id, name } = req.query;

    const whereClause: any = {};

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const courses = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: CourseCategory,
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(courses);
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error("Error getting course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.json(course);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const destroy = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
