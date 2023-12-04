import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester is created successfully',
    data: result,
  });
});

const getAllAcademicSemesterFromDB = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully',
    data: result,
  });
});

const getSingleSemesterFromDB = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getSingleSemesterFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieve successfully by id',
    data: result,
  });

  return result;
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    req.params.semesterId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Update successfully by id',
    data: result,
  })
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesterFromDB,
  getSingleSemesterFromDB,
  updateAcademicSemester,
};
