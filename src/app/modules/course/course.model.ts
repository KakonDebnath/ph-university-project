import { Schema, model } from 'mongoose';
import { TCourse, TPrerequisiteCourses } from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPrerequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course"
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: [true, 'Course Title is required'],
    trim: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: [true, 'Course prefix is required'],
    trim: true,
  },
  code: {
    type: Number,
    required: [true, 'Course Code is required'],
    trim: true,
  },
  credits: {
    type: Number,
    required: [true, 'Course credits is required'],
    trim: true,
  },
  preRequestCourse: [preRequisiteCoursesSchema],
});

export const Course = model<TCourse>('Course', courseSchema);
