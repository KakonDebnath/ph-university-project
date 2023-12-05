import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
// use query middleware for checking
academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isAcademicFacultyExist = await AcademicFaculty.findOne(query);
  if (!isAcademicFacultyExist) {
    throw new Error(' This Faculty does not exist');
  }
  next();
});
export const AcademicFaculty = model('AcademicFaculty', academicFacultySchema);
