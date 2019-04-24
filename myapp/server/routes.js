import examplesRouter from './api/controllers/examples/router';
// import main from '../../'
export default function routes(app) {
  app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });

  app.use('/', examplesRouter);
}
