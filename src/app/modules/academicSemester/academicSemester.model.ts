import { Schema, model } from 'mongoose';
import {
  TAcademicSemester,
} from './academicSemester.interface';
import { Months, academicSemesterCode, academicSemesterName } from './academicSemester.constant';


const academicSemester = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: academicSemesterName,
      required: true,
    },
    code: {
      type: String,
      enum: academicSemesterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);



academicSemester.pre("save", async function (next){

  const isSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name
  })

  if(isSemesterExist){
    throw new Error("This Semester is already exists ")
  }
  next();

})

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemester,
);
