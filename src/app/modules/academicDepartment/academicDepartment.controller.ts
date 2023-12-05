import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartmentIntoDB = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Department created successfully',
    data: result,
  });
});

const getAllAcademicDepartmentFormDB = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentFormDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Departments are retrieved successfully',
    data: result,
  });
});

const getSingleAcademicFacultyFormDB = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFormDB(
      req.params.id,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Academic Department get successfully!',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.updateAcademicDepartment(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Department updated successfully',
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFormDB,
  getSingleAcademicFacultyFormDB,
  updateAcademicDepartment,
};
