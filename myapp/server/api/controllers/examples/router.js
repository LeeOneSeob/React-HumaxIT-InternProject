import * as express from 'express';
import fs from 'fs';
import { connect } from '../../../helpers/sql';
import { queries } from './queries';
import { generateToken, checkToken } from './token';

export default express
  .Router()
  .get(
    '/api/study/filter/:fiterSearchText/:filterActor/:filterGroupName/:filterTime/:limit/:offset',
    async (req, res) => {
      try {
        const user = {
          id: undefined,
        };

        const {
          fiterSearchText,
          filterActor,
          filterGroupName,
          filterTime,
          limit,
          offset,
        } = req.params;
        const { token } = req.headers;

        if (token) {
          const { uid, serverToken } = await checkToken(token);
          user.id = uid;
        }

        const getQueryResult = connect(async (con, id) => {
          const result = await con.query(
            await queries.selectFilterStudy(
              fiterSearchText,
              filterActor,
              filterGroupName,
              filterTime,
              user.id,
              limit,
              offset,
            ),
          );
          return result;
        });

        const resResult = await getQueryResult();

        res.json(resResult);
      } catch (error) {
        console.log(error);
      }
    },
  )
  .post('/api/study', async (req, res) => {
    // 강좌 개설
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const {
          courseTitle,
          courseDescription,
          courseStartDate,
          courseEndDate,
          groupCode,
        } = req.body;
        await con.query(
          await queries.insertCourse(
            courseTitle,
            courseDescription,
            courseStartDate,
            courseEndDate,
            groupCode,
            uid,
          ),
        );
        return true;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .put('/api/study', async (req, res) => {
    // 강좌 수정
    try {
      const { token } = req.headers;
      const {
        courseCode,
        courseTitle,
        courseDescription,
        courseStartDate,
        courseEndDate,
        groupCode,
      } = req.body;
      const { uid, serverToken } = await checkToken(token);
      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(
          await queries.updateCourse(
            courseCode,
            courseTitle,
            courseDescription,
            courseStartDate,
            courseEndDate,
            groupCode,
          ),
        );
        return 1;
      });
      const result = await getQueryResult();

      if (result === 1) {
        res.json(1);
      }
    } catch (error) {
      console.log(error);
      res.json(2);
    }
  })
  .delete('/api/study/:courseCode', async (req, res) => {
    // 강좌 삭제
    try {
      const { courseCode } = req.params;
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.deleteCourse(courseCode));
        return 1;
      });
      const result = await getQueryResult();

      if (result === 1) {
        res.json(1);
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/study/mentee', async (req, res) => {
    // 로그인 사용자가 가입한 강좌 조회 (사용자가 멘티일 경우)
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(await queries.selectStudyByMentee(uid));
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/study/mento', async (req, res) => {
    // 로그인 사용자가 개설한 강좌 조회 (사용자가 멘토일 경우)
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(await queries.selectStudyByMento(uid));
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })

  .post('/api/study/join', async (req, res) => {
    // 사용자가 해당 강좌를 가입
    try {
      const { token } = req.headers;
      const { courseCode } = req.body;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.insertJoin(courseCode, uid));
        return 1;
      });
      const getQueryResult2 = connect(async (con, id) => {
        await con.query(await queries.insertAddNumPeople(courseCode));
        return 1;
      });

      const result = await getQueryResult();
      const result2 = await getQueryResult2();

      if (result === 1 && result2 === 1) {
        res.json(1);
      }
    } catch (error) {
      console.log(error);
    }
  })
  .delete('/api/study/join/:courseCode', async (req, res) => {
    // 사용자가 해당 강좌를 탈퇴
    try {
      const { courseCode } = req.params;
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.deleteJoin(uid, courseCode));
        return 1;
      });
      const getQueryResult2 = connect(async (con, id) => {
        await con.query(await queries.deleteSubNumPeople(courseCode));
        return 1;
      });

      const result = await getQueryResult();
      const result2 = await getQueryResult2();

      if (result === 1 && result2 === 1) {
        res.json(1);
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/study/group', async (req, res) => {
    // 강좌 그룹 조회
    try {
      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(queries.selectGroupName);
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/member', async (req, res) => {
    // 사용자 로그인
    try {
      const getQueryResult = connect(async (con, id) => {
        const { uid, pwd } = req.headers;
        const result = await con.query(await queries.selectLoginUser(uid, pwd));

        if (result.length > 0) {
          const token = await generateToken({
            uid: result[0].userId,
          });
          const data = {
            loggedIn: true,
            userId: result[0].userId,
            userName: result[0].userName,
            userPhone: result[0].userPhone,
            userEmail: result[0].userEmail,
            userPhoto: result[0].userPhoto,
          };
          return { user: data, token };
        }
        return false;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .post('/api/member', async (req, res) => {
    // 회원가입
    try {
      const getQueryResult = connect(async (con, id) => {
        const { userId, password, name, phone, email } = req.body;
        await con.query(
          await queries.insertUser(userId, password, name, phone, email),
        );
        res.json(true);
      });

      await getQueryResult();
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .put('/api/member', async (req, res) => {
    // 회원정보 수정
    const { token } = req.headers;
    const { password, name, phone, email } = req.body;

    const { uid, serverToken } = await checkToken(token);
    if (!serverToken) {
      res.json(0); // token invalid
    }

    try {
      const getQueryResult = connect(async (con, id) => {
        await con.query(
          await queries.updateUser(uid, password, name, phone, email),
        );
        return 1; // success
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .delete('/api/member', async (req, res) => {
    // 회원 탈퇴
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.deleteUser(uid));
        return 1;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/member/check/:checkId', async (req, res) => {
    // 아이디 중복 체크
    try {
      const getQueryResult = connect(async (con, id) => {
        const { checkId } = req.params;
        const result = await con.query(await queries.checkUserId(checkId));

        if (result.length > 0) {
          return true;
        }

        return false;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .get('/api/classroom/mento/:mentoId', async (req, res) => {
    // 클래스룸 페이지에서 멘토 정보 조회
    try {
      const { token } = req.headers;
      const { mentoId } = req.params;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(await queries.selectMentoInfo(mentoId));
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })
  .get('/api/classroom/assign/:courseCode/:limit/:offset', async (req, res) => {
    // 해당 클래스룸 과제 조회
    try {
      const { token } = req.headers;
      const { courseCode, limit, offset } = req.params;

      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(
          await queries.getAssignmentByCourseCode(courseCode, limit, offset),
        );
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })
  .post('/api/classroom/assign', async (req, res) => {
    // 과제 등록
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const {
          assignTitle,
          assignDescription,
          assignDeadline,
          courseCode,
        } = req.body;
        await con.query(
          await queries.insertAssignment(
            assignTitle,
            assignDescription,
            assignDeadline,
            courseCode,
          ),
        );
        return true;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .put('/api/classroom/assign', async (req, res) => {
    // 해당 과제 수정
    const { token } = req.headers;
    const {
      assignCode,
      assignTitle,
      assignDescription,
      assignDeadline,
    } = req.body;

    const { uid, serverToken } = await checkToken(token);
    if (!serverToken) {
      res.json(0); // token invalid
    }

    try {
      const getQueryResult = connect(async (con, id) => {
        await con.query(
          await queries.updateAssignment(
            assignCode,
            assignTitle,
            assignDescription,
            assignDeadline,
          ),
        );
        return 1; // success
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .delete('/api/classroom/assign/:assignCode', async (req, res) => {
    // 해당 과제 삭제
    try {
      const { token } = req.headers;
      const { assignCode } = req.params;

      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.deleteAssignment(assignCode));
        return 1;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
  .get(
    '/api/classroom/submitAssign/:assignCode/:courseCode/:limit/:offset',
    async (req, res) => {
      // 제출 과제 조회
      try {
        const { token } = req.headers;
        const { assignCode, courseCode, limit, offset } = req.params;

        const { uid, serverToken } = await checkToken(token);

        if (!serverToken) {
          res.json(0); // token invalid
        }

        const getQueryResult = connect(async (con, id) => {
          const result = await con.query(
            await queries.selectSubmitAssignment(
              assignCode,
              courseCode,
              limit,
              offset,
            ),
          );
          res.json(result);
        });

        await getQueryResult();
      } catch (error) {
        console.log(error);
      }
    },
  )
  .post('/api/classroom/submitAssign', async (req, res) => {
    // 제출과제 등록
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const {
          assignCode,
          courseCode,
          submitAssignTitle,
          submitAssignDescription,
          fileKey,
        } = req.body;
        await con.query(
          await queries.insertSubmitAssignment(
            assignCode,
            courseCode,
            uid,
            submitAssignTitle,
            submitAssignDescription,
            fileKey,
          ),
        );
        return true;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .post('/api/classroom/submitAssign/upload', async (req, res) => {
    // 제출과제 파일 업로드
    try {
      if (req.files) {
        // 파일 업로드
        fs.readFile(req.files.file.path, function(error, data) {
          const filePath = `${__dirname}\\files\\${req.files.file.name}`;
          fs.writeFile(filePath, data, function(error) {
            if (error) {
              console.log(error);
            } else {
              // res.redirect('back');
            }
          });
        });

        // DB 업로드
        const getQueryResult = connect(async (con, id) => {
          await con.query(
            await queries.insertSubmitFile(
              req.files.file.name,
              req.files.file.originalname,
              req.files.file.mimetype,
              req.files.file.size,
            ),
          );
          return true;
        });

        await getQueryResult();
      }
      res.json(req.files.file.name);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .get(
    '/api/classroom/submitAssign/download/:file/:originalFileName',
    async (req, res) => {
      // 제출과제 다운로드
      try {
        const { token } = req.headers;
        const { file, originalFileName } = req.params;
        const { uid, serverToken } = await checkToken(token);

        if (!serverToken) {
          res.json(0); // token invalid
        }
        const fileLocation = `${__dirname}\\files\\${file}`;
        res.download(fileLocation);
      } catch (error) {
        console.log(error);
      }
    },
  )
  .get('/api/classroom/notice/:courseCode/:limit/:offset', async (req, res) => {
    // 공지 조회
    try {
      const { token } = req.headers;
      const { courseCode, limit, offset } = req.params;

      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const result = await con.query(
          await queries.selectNotice(courseCode, limit, offset),
        );
        res.json(result);
      });

      await getQueryResult();
    } catch (error) {
      console.log(error);
    }
  })
  .post('/api/classroom/notice', async (req, res) => {
    // 공지 등록
    try {
      const { token } = req.headers;
      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        const { noticeTitle, noticeContent, courseCode } = req.body;
        await con.query(
          await queries.insertNotice(noticeTitle, noticeContent, courseCode),
        );
        return true;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(false);
    }
  })
  .put('/api/classroom/notice', async (req, res) => {
    // 해당 공지 수정
    const { token } = req.headers;
    const { noticeCode, noticeTitle, noticeContent } = req.body;

    const { uid, serverToken } = await checkToken(token);
    if (!serverToken) {
      res.json(0); // token invalid
    }

    try {
      const getQueryResult = connect(async (con, id) => {
        await con.query(
          await queries.updateNotice(noticeCode, noticeTitle, noticeContent),
        );
        return 1; // success
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  })
  .delete('/api/classroom/notice/:noticeCode', async (req, res) => {
    // 해당 공지 삭제
    try {
      const { token } = req.headers;
      const { noticeCode } = req.params;

      const { uid, serverToken } = await checkToken(token);

      if (!serverToken) {
        res.json(0); // token invalid
      }

      const getQueryResult = connect(async (con, id) => {
        await con.query(await queries.deleteNotice(noticeCode));
        return 1;
      });

      const result = await getQueryResult();
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  });
