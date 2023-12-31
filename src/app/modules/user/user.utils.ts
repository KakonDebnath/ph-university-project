// year semesterCode 4digit number
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastUserId = async (role: string) => {
  const lastUserId = await User.findOne(
    {
      role: role,
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  //2030010001
  return lastUserId?.id ? lastUserId.id : undefined;
};

// export const generateStudentId = async (payload: TAcademicSemester) => {
//   // first time 0000
//   //0001  => 1
//   let currentId = (0).toString(); // 0000 by default
//   const lastStudentId = await findLastUserId('student'); //2030010001

//   // get last student id from db
//   const lastStudentYear = lastStudentId?.substring(0, 4); //2030
//   const lastStudentSemesterCode = lastStudentId?.substring(4, 6); //01
//   // get current student year and semester code
//   const currentStudentYear = payload.year;
//   const currentStudentSemesterCode = payload.code;

//   if (
//     lastStudentId &&
//     lastStudentYear === currentStudentYear &&
//     lastStudentSemesterCode === currentStudentSemesterCode
//   ) {
//     currentId = lastStudentId.substring(6); //0001
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   incrementId = `${payload.year}${payload.code}${incrementId}`;

//   return incrementId;
// };

// export const generateAdminFacultyId = async (role: string) => {
//   let currentId = (0).toString();
//   const lastUserId = await findLastUserId(role);

//   if (lastUserId) {
//     currentId = lastUserId.substring(2);
//   }
//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   if (role === 'admin') {
//     incrementId = `A-${incrementId}`;
//   }
//   if (role === 'faculty') {
//     incrementId = `F-${incrementId}`;
//   }

//   return incrementId;
// };

export const generatedId = async (
  payload: TAcademicSemester | null,
  role: string,
) => {
  let incrementId: string = '';
  let currentId = (0).toString();
  const lastUserId = await findLastUserId(role);
  if (role === 'student') {
    // get last student id from db
    const lastStudentYear = lastUserId?.substring(0, 4); //2030
    const lastStudentSemesterCode = lastUserId?.substring(4, 6); //01
    // get current student year and semester code
    const currentStudentYear = payload?.year;
    const currentStudentSemesterCode = payload?.code;

    if (
      lastUserId &&
      lastStudentYear === currentStudentYear &&
      lastStudentSemesterCode === currentStudentSemesterCode
    ) {
      currentId = lastUserId.substring(6); //0001
    }

    incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `${currentStudentYear}${currentStudentSemesterCode}${incrementId}`;
  }
  if (role === 'admin') {
    if (lastUserId) {
      currentId = lastUserId.substring(2);
    }
    incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `A-${incrementId}`;
  }
  if (role === 'faculty') {
    if (lastUserId) {
      currentId = lastUserId.substring(2);
    }
    incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `F-${incrementId}`;
  }

  return incrementId;
};
