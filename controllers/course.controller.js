import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
const getAllCourses = async function (req, res, next) {
  try {
    const courses = await Course.find({}).select("-lectures");
    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
};
const getLecturesByCourseId = async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findById(id);
    if (!course) {
      new AppError("course not found with provided id", 400);
    }
    res.status(200).json({
      success: true,
      message: "couse",
      data: course.lecutres,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required ", 400));
  }
  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail:{
      public_id:"dummy",
      secure_url:"dummy"
    },
  });

  if (!course) {
    return next(
      new AppError("Course could not be created ! please try again later", 500)
    );
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }
      await fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      return next(
        new AppError(error,500)
      );
    }
  }

  await course.save();
  res.status(200).json({
    success: true,
    message: "Course created successfully",
    course,
  });
};
const updateCourse = async (req, res, next) => {
  try {
    const {id} = req.params;
    const course= await Course.findByIdAndUpdate(
      id,
      {
        $set:req.body
      },{
        runValidators:true
      }
    );
    if(!course){
      return next(
        new AppError("Course with the given id does not exists", 500)
      );
    }
    res.status(200).json({
      success:true,
      message:'course updated successfully ',
      course
    })
  } catch (error) {
    return next(
      new AppError(error, 500)
    );
  }
};
const removeCourse = async (req, res, next) => {
  try {
    const {id} = req.params;
    const course =await Course.findByIdAndDelete(id);
    if(!course){
      return next(
        new AppError("course with the give id not found! please provide a valid id", 500)
      );
    }
    res.status(200).json({
      success:true,
      message: 'course deleted successfully ',
      course
    })
  } catch (error) {
    return next(
      new AppError(error, 500)
    );
  }
};

const addLecturesToCourseId = async()=>{
  try {
    const {id}= req.params;
    const {title,description}=req.body;
  
    if (!title || !description) {
      return next(
        new AppError("All field are required", 500)
      );
    }
    const course = await Course.findById(id);
     
    if (!course) {
      return next(
        new AppError("Course could not be created ! please try again later", 500)
      );
    }
  
    const lecturesData = {
      title,
      description,
      lecture:{}
    };
  
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });
        if (result) {
          lecturesData.lecture.public_id = result.public_id;
          lecturesData.lecture.secure_url = result.secure_url;
        }
        await fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(
          new AppError(error,500)
        );
      }
    }
  
    course.lecutres.push(lecturesData)
    course.numberOfLecutres = course.lecutres.length;
    await course.save();
  
    res.status(200).json({
      success:true,
      message:"Lectures successfully added to the course ",
      course
    })
  
  } catch (error) {
    return next(
      new AppError(error,500)
    );
  }
}

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLecturesToCourseId
};
