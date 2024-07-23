import { Router } from "express";
import { getAllCourses,getLecturesByCourseId,createCourse,updateCourse,removeCourse,addLecturesToCourseId } from "../controllers/course.controller.js";
import {isLoggedIn,  authorizedRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router =  Router();

router.route('/')
      .get(getAllCourses)
      .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single('thumbnail'),
        createCourse
        );
router.route('/:id')
      .get( isLoggedIn,getLecturesByCourseId)
      .put(
        authorizedRoles("ADMIN"),
        isLoggedIn,
        updateCourse
        )
      .delete(
        authorizedRoles("ADMIN"),
        isLoggedIn,
        removeCourse
        )
      .post(
        authorizedRoles("ADMIN"),
        isLoggedIn,
        upload.single("lecutre"),
        addLecturesToCourseId
      )
      ;

export default router;