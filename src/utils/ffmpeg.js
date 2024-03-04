const httpStatus = require("http-status");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ApiError = require("./ApiError");

const getDuration = async(path) => {
    const command = `ffmpeg -i ${path} 2>&1 | grep "Duration"| cut -d \' \' -f 4 | sed s/,// | sed \'s@\\..*@@g\' | awk \'{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + B[1] }\'`;
    const { stdout, stderr } = await exec(command);
    if (stderr) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "get duration error"
        );
    }
    return parseFloat(stdout.trim());
}

module.exports = { getDuration }

