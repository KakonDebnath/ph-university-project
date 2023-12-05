import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const isAcademicFacultyExist = await AcademicFaculty.findOne({
    name: payload.name,
  });
  if (isAcademicFacultyExist) {
    throw new Error('This Faculty is already exists ');
  }
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFacultyFormDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleAcademicFacultyFormDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateAcademicFacultyFormDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFormDB,
  getSingleAcademicFacultyFormDB,
  updateAcademicFacultyFormDB,
};
