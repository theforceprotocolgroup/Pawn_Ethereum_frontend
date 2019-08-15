const gulp = require('gulp');
const scp2 = require('gulp-scp2');

const SERVER_HOST_TEST = '*.*.*.*';
const PORT = 22;
const USERNAME = 'root';
const PASSWORD = 'password';
const PATH = '/data/web/kcash_protocol_page';

gulp.task('scp:dev', () => {
  return gulp.src('./dist/**/*')
    .pipe(scp2({
      host: SERVER_HOST_TEST,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
      dest: PATH,
      watch(client) {
        client.on('write', function(o) {
          console.log('正在上传的文件：        ' + o.destination);
        });
        client.on('end', function(o) {
          console.log(`[scp:dev 上传完成`);
        });
      }
    }))
    .on('error', function(err) {
      console.error(err);
    });
});
