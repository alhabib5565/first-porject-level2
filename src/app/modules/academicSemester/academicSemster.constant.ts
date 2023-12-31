import { TAcademicSemesterCode, TAcademicSemesterCodeMapper, TAcademicSemesterName, TMonths } from "./academicSemster.interface";

export const AcademicSemesterMonths: TMonths[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const AcademicSemesterName: TAcademicSemesterName[] = ['Autumn', 'Summar', 'Fall']
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03']


export const academicSemesterNameCodeMapper: TAcademicSemesterCodeMapper = {
    Autumn: '01',
    Summar: '02',
    Fall: '03'
}