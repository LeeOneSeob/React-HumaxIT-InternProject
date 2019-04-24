const getToday = () => {
  // 현재날짜를 가져오는 함수
  const date = new Date();
  const today = { year: '', month: '', day: '' };
  if (date.getDate() < 10) {
    today.day = `0${date.getDate()}`;
  } else {
    today.day = date.getDate();
  }
  if (date.getMonth() + 1 < 10) {
    today.month = `0${date.getMonth() + 1}`;
  } else {
    today.month = date.getMonth() + 1;
  }
  today.year = date.getFullYear();
  return `${today.year}-${today.month}-${today.day}`;
};

export const queries = {
  selectFilterStudy: (
    fiterSearchText,
    filterActor,
    filterGroupName,
    filterTime,
    uid,
    limit,
    offset,
  ) => {
    const query = { data: '', join: '' };

    if (fiterSearchText !== '0' && fiterSearchText !== '') {
      query.data = `${
        query.data
      } (c.courseTitle LIKE '%${fiterSearchText}%' OR u.userName LIKE '%${fiterSearchText}%') AND `;
    }

    if (filterActor !== '0' && uid) {
      if (filterActor === 'mento') {
        query.data = `${query.data} c.mentoId='${uid}' AND `;
      }
      if (filterActor === 'mentee') {
        query.join = `
        INNER JOIN classroom.Join j 
          ON c.courseCode = j.courseCode`;
        query.data = `${query.data} j.menteeId='${uid}' AND `;
      }
    }

    if (filterGroupName !== '0') {
      if (filterGroupName !== '전체 과목')
        query.data = `${query.data} g.groupCode= ${filterGroupName} AND `;
    }

    if (filterTime !== '0') {
      const compToday = getToday();

      if (filterTime === 'ing') {
        query.data = `${
          query.data
        } c.courseEndDate >= '${compToday}' AND c.courseStartDate <= '${compToday}' AND `;
      }

      if (filterTime === 'ed') {
        query.data = `${query.data} c.courseEndDate < '${compToday}' AND `;
      }
      if (filterTime === 'will') {
        query.data = `${query.data} c.courseStartDate > '${compToday}' AND `;
      }
    }
    query.data = `${query.data} 1=1`;

    if (
      fiterSearchText === '0' &&
      filterActor === '0' &&
      filterGroupName === '0' &&
      filterTime === '0'
    ) {
      query.data = '1=1';
    }

    return `
      SELECT SQL_CALC_FOUND_ROWS c.courseCode, c.courseTitle, c.courseDescription, c.courseNumPeople, 
             DATE_FORMAT(c.courseStartDate, "%W %M %e %Y") as 'courseStartDate',
             DATE_FORMAT(c.courseEndDate, "%W %M %e %Y") as 'courseEndDate',
             DATE_FORMAT(c.courseStartDate, "%Y-%m-%d") as 'compareStartDate',
             DATE_FORMAT(c.courseEndDate, "%Y-%m-%d") as 'compareEndDate',
             u.userName, g.groupName, g.groupPicture, c.mentoId
        FROM classroom.Course c 
             INNER JOIN classroom.User u 
               ON c.mentoId = u.userId 
             INNER JOIN classroom.Group g
               ON c.groupCode = g.groupCode
             ${query.join}
       WHERE ${query.data}
    ORDER BY compareStartDate DESC
       LIMIT ${offset}, ${limit};
    SELECT FOUND_ROWS() AS 'totalRow';`;
  },

  insertCourse: (
    courseTitle,
    courseDescription,
    courseStartDate,
    courseEndDate,
    groupCode,
    mentoId,
  ) => {
    return `
  INSERT INTO classroom.Course (courseTitle, courseDescription, courseNumPeople, courseStartDate, courseEndDate, groupCode, mentoId) 
       VALUES ('${courseTitle}', '${courseDescription}', 1, '${courseStartDate}', '${courseEndDate}', ${groupCode}, '${mentoId}')`;
  },

  updateCourse: (
    courseCode,
    courseTitle,
    courseDescription,
    courseStartDate,
    courseEndDate,
    groupCode,
  ) => {
    return `
  UPDATE classroom.Course 
     SET courseTitle='${courseTitle}', courseDescription='${courseDescription}',
         courseStartDate='${courseStartDate}', courseEndDate='${courseEndDate}', 
         groupCode=${groupCode} 
   WHERE courseCode =${courseCode}`;
  },

  deleteCourse: courseCode => {
    return `
    DELETE 
      FROM classroom.Course
     WHERE courseCode = ${courseCode}`;
  },

  selectStudyByMentee: id => {
    return `
    SELECT courseCode, menteeId
      FROM classroom.Join
     WHERE menteeId = '${id}'`;
  },

  selectStudyByMento: id => {
    return `
    SELECT courseCode, mentoId
      FROM classroom.Course
     WHERE mentoId = '${id}'`;
  },

  insertJoin: (courseCode, id) => {
    return `
    INSERT INTO classroom.Join (courseCode, menteeId) 
         VALUES (${courseCode}, '${id}')`;
  },

  deleteJoin: (menteeId, courseCode) => {
    return `
    DELETE 
      FROM classroom.Join
     WHERE courseCode = ${courseCode} AND menteeId ='${menteeId}'`;
  },

  selectLoginUser: (id, pwd) => {
    return `
    SELECT userId, userName, userPhone, userEmail, userPhoto 
      FROM classroom.User 
     WHERE userId = '${id}' 
       AND userPw = md5('${pwd}')`;
  },

  insertUser: (id, pwd, name, phone, email) => {
    return `
    INSERT INTO classroom.User (userId, userPw, userName, userPhone, userEmail, userPhoto) 
                        VALUES ('${id}', md5('${pwd}'), '${name}', '${phone}', '${email}', null)`;
  },

  deleteUser: id => {
    return `
    DELETE 
      FROM classroom.User
     WHERE userId = '${id}'`;
  },

  checkUserId: id => {
    return `
    SELECT 1 
      FROM classroom.User 
     WHERE userId = '${id}'`;
  },

  updateUser: (id, pwd, name, phone, email) => {
    return `
    UPDATE classroom.User 
       SET userPw=md5('${pwd}'), userName='${name}',
           userPhone='${phone}', userEmail='${email}', 
           userPhoto=null 
     WHERE userId ='${id}'`;
  },

  selectGroupName: `
  SELECT groupCode, groupName 
    FROM classroom.Group`,

  insertAddNumPeople: courseCode => {
    return `
    UPDATE classroom.Course 
       SET courseNumPeople = courseNumPeople + 1
     WHERE courseCode = ${courseCode}`;
  },

  deleteSubNumPeople: courseCode => {
    return `
    UPDATE classroom.Course 
       SET courseNumPeople = courseNumPeople - 1
     WHERE courseCode = ${courseCode}`;
  },

  // 이 밑으로 classroom 부분

  selectMentoInfo: mentoId => {
    return `
    SELECT userName, userPhone, userEmail, userPhoto
      FROM classroom.User
     WHERE userId = '${mentoId}'`;
  },

  getAssignmentByCourseCode: (courseCode, limit, offset) => {
    return `
    SELECT SQL_CALC_FOUND_ROWS asignCode, asignTitle, asignDescription, asignReadNum, 
           DATE_FORMAT(asignDeadline, "%Y-%m-%d") as 'asignDeadline',
           DATE_FORMAT(asignDate, "%Y-%m-%d") as 'asignDate'
      FROM  classroom.ClassroomAsign
     WHERE courseCode = ${courseCode}
  ORDER BY asignDate DESC
     LIMIT ${offset}, ${limit};
  SELECT FOUND_ROWS() AS 'totalRow';`;
  },

  insertAssignment: (
    assignTitle,
    assignDescription,
    assignDeadline,
    courseCode,
  ) => {
    return `
      INSERT INTO classroom.ClassroomAsign (asignTitle, asignDescription, asignReadNum, asignDeadline, asignDate, courseCode)
           VALUES ('${assignTitle}', '${assignDescription}', 0, '${assignDeadline}', NOW(), ${courseCode})`;
  },

  deleteAssignment: assignCode => {
    return `
    DELETE
      FROM classroom.ClassroomAsign
     WHERE asignCode = ${assignCode}`;
  },

  updateAssignment: (
    assignCode,
    assignTitle,
    assignDescription,
    assignDeadline,
  ) => {
    return `
    UPDATE classroom.ClassroomAsign
       SET asignTitle = '${assignTitle}',
           asignDescription = '${assignDescription}',
           asignDeadline = '${assignDeadline}'
     WHERE asignCode = ${assignCode}`;
  },

  selectSubmitAssignment: (assignCode, courseCode, limit, offset) => {
    const query = { data: '' };
    if (assignCode === '0') {
      query.data = `s.courseCode=${courseCode}`;
    } else {
      query.data = `s.asignCode=${assignCode} AND s.courseCode=${courseCode}`;
    }

    return `
    SELECT  SQL_CALC_FOUND_ROWS s.submitAsignTitle, s.submitAsignDescription, s.asignCode, s.courseCode,
            DATE_FORMAT(s.submitAsignDate, "%Y-%m-%d") as submitAsignDate, u.userName as 'menteeName', 
            a.asignTitle, f.serverFileName, f.originalFileName, f.fileSize
      FROM classroom.ClassroomSubmitAsign s 
           INNER JOIN classroom.User u 
             ON s.menteeId = u.userId
           INNER JOIN classroom.ClassroomAsign a
             ON s.asignCode = a.asignCode
           LEFT OUTER JOIN classroom.ClassroomSubmitFile f
             ON f.serverFileName = s.serverFileName
     WHERE ${query.data}
  ORDER BY asignCode DESC
     LIMIT ${offset}, ${limit};
    SELECT FOUND_ROWS() AS 'totalRow';`;
  },

  insertSubmitFile: (
    serverFileName,
    originalFileName,
    fileExtension,
    fileSize,
  ) => {
    return `
    INSERT INTO classroom.ClassroomSubmitFile (serverFileName, originalFileName, fileExtension, fileSize)
         VALUES ('${serverFileName}', '${originalFileName}', '${fileExtension}', ${fileSize})`;
  },

  insertSubmitAssignment: (
    assignCode,
    courseCode,
    menteeId,
    submitAssignTitle,
    submitAssignDescription,
    fileKey,
  ) => {
    const query = { data: ', null' };
    if (fileKey) {
      query.data = `, '${fileKey}'`;
    }
    return `
    INSERT INTO classroom.ClassroomSubmitAsign (asignCode, courseCode, menteeId, submitAsignTitle, submitAsignDescription, submitAsignDate, serverFileName)
         VALUES (${assignCode}, ${courseCode}, '${menteeId}', '${submitAssignTitle}', '${submitAssignDescription}', NOW() ${
      query.data
    })`;
  },

  selectNotice: (courseCode, limit, offset) => {
    return `
    SELECT SQL_CALC_FOUND_ROWS noticeCode, noticeTitle, noticeContent, 
           DATE_FORMAT(noticeDate, "%Y-%m-%d") as noticeDate 
      FROM classroom.ClassroomNotice
     WHERE courseCode = ${courseCode}
  ORDER BY noticeCode DESC
     LIMIT ${offset}, ${limit};
    SELECT FOUND_ROWS() AS 'totalRow';`;
  },

  insertNotice: (noticeTitle, noticeContent, courseCode) => {
    return `
    INSERT INTO classroom.ClassroomNotice (noticeTitle, noticeContent, noticeDate, courseCode) 
         VALUES ('${noticeTitle}', '${noticeContent}', NOW(), ${courseCode})`;
  },

  updateNotice: (noticeCode, noticeTitle, noticeContent) => {
    return `
    UPDATE classroom.ClassroomNotice
       SET noticeTitle = '${noticeTitle}',
           noticeContent = '${noticeContent}'
     WHERE noticeCode = ${noticeCode}`;
  },

  deleteNotice: noticeCode => {
    return `
    DELETE 
      FROM classroom.ClassroomNotice
     WHERE noticeCode = ${noticeCode}`;
  },
};
