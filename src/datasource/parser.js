import R from 'ramda';
import moment from 'moment';
import { capitalize } from '../utilities';

const computeAbsenceLevelSeverity = level => {
  if (R.equals(3, level)) return 'HIGH';
  if (R.equals(2, level)) return 'MEDIUM';
  return 'LOW';
};

const transformAttendance = element => ({
  code: R.replace(/\s/g, '', element.Code),
  name: R.trim(element.Name),
  level: Number(element.AbsenceLevel),
  severity: computeAbsenceLevelSeverity(element.AbsenceLevel),
});

const transformCourses = element => ({
  code: R.pipe(R.match(/\((.*?)\)/), R.view(R.lensIndex(1)))(
    element.course_short_name,
  ),
  name: R.pipe(R.replace(/\((.*?)\)/, ''), R.trim)(element.course_short_name),
});

const transformCoursework = aggregation =>
  R.map(element => {
    const course = R.find(currentCourse =>
      R.equals(currentCourse.sm_crs_id, element.sm_crs_id),
    )(aggregation.CurrentCourses);
    return {
      code: R.pipe(R.match(/\((.*?)\)/), R.view(R.lensIndex(1)))(
        course.course_short_name,
      ),
      name: R.pipe(R.replace(/\((.*?)\)/, ''), R.trim)(
        course.course_short_name,
      ),
      type: R.pipe(R.trim, capitalize)(element.eval_method_name),
      grade: Number(element.grade),
      maximumGrade: Number(element.max_point),
    };
  })(aggregation.CourseWork);

const transformMidterms = element => ({
  code: R.pipe(
    R.split('-'),
    R.view(R.lensIndex(1)),
    R.trim,
    R.split(' '),
    R.last,
    R.trim,
  )(element.course_full_name),
  name: R.pipe(
    R.split('-'),
    R.view(R.lensIndex(1)),
    R.trim,
    R.split(' '),
    R.dropLast(1),
    R.join(' '),
    R.trim,
  )(element.course_full_name),
  grade: Number(element.total_perc),
});

const transformExams = element => ({
  code: R.pipe(
    R.replace(/^.+-/, ''),
    R.trim,
    R.split(' '),
    R.take(1),
    R.join(' '),
  )(element.course_name),
  name: R.pipe(
    R.replace(/^.+-/, ''),
    R.trim,
    R.split(' '),
    R.drop(1),
    R.join(' '),
  )(element.course_name),
  venue: element.rsrc_code,
  seat: element.seat_code,
  startsAt: moment(
    R.replace(/\s\s/g, ' ', element.start_time),
    'MMM D YYYY h:mmA',
    true,
  ).toISOString(),
});

const transformSchedule = element => ({
  course: {
    code: R.replace(/\s/g, '', element.course_short_code),
    name: R.pipe(R.split('-'), R.take(1), R.join(' '), R.trim)(element.course),
  },
  type: R.equals('Tut', element.class_type)
    ? 'TUTORIAL'
    : R.toUpper(element.class_type),
  weekday: R.toUpper(element.weekday),
  number: Number(element.scd_col),
  venue: R.trim(element.location),
});

const transformTranscript = aggregation => ({
  cumulativeGPA: aggregation.CumGPA,
  semesters: R.pipe(
    R.map(element => {
      const semester = R.find(R.propEq('season_id', element.season_id))(
        aggregation.Transcript,
      );
      return {
        year: R.pipe(
          R.prop('Semester'),
          R.split(' '),
          R.takeLast(1),
          R.join(''),
          Number,
        )(semester),
        type: R.pipe(
          R.prop('Semester'),
          R.split(' '),
          R.take(1),
          R.join(''),
          R.toUpper,
        )(semester),
        gpa: element.gpa,
        entries: R.pipe(
          R.filter(R.eqProps('Semester', semester)),
          R.map(entry => ({
            course: {
              code: R.replace(/\s/g, '', entry.course_code),
              name: R.trim(entry.course_name),
            },
            grade: {
              german: Number(entry.de_result),
              american: entry.us_result,
            },
            creditHours: Number(entry.total_h),
          })),
        )(aggregation.Transcript),
      };
    }),
    R.uniqWith(R.allPass([R.eqProps('year'), R.eqProps('type')])),
  )(aggregation.GPAPerSn),
});

export const parseLogin = R.pathEq(['data', 'd'], 'True');

export const parseAttendance = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.prop('AbsenceReport'),
  R.map(transformAttendance),
);

export const parseCourses = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.prop('CurrentCourses'),
  R.map(transformCourses),
);

export const parseCoursework = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  transformCoursework,
);

export const parseMidterms = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.prop('Midterm'),
  R.map(transformMidterms),
);

export const parseExams = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.map(transformExams),
);

export const parseSchedule = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.map(transformSchedule),
);

export const parseTranscript = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  transformTranscript,
);
