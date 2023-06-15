<template>
  <div>
    <el-upload
    class="avatar-uploader"
    action="123"
    :show-file-list="false"
    :http-request="uploadImage"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <p>dadsadasdasd</p>
    <button @click="get()">111111</button>
    <el-upload
    class="upload-userAvatar"
    ref="upload"
    action="#"
    :http-request="uploadImage"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    :limit="1"
    :on-exceed="handleExceed"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <div slot="tip" class="el-upload__tip">不选择上传就不更新头像</div>
  </el-upload>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  </div>
    
</template>


<script>
import { uploadAvatar } from '@/api/apis/picUrl';
  export default {
    data() {
      return {
        imageUrl:"",
        fileList: []
      };
    },
    methods: {
      get(){
        console.log(this.fileList)
      },
      uploadImage(param){
        console.log("sshit")
        console.log(param)
        console.log("upload")
        const formData = new FormData()
        formData.append('file', param.file)
        uploadAvatar(formData).then(response => {
            console.log(formData)
            console.log('上传图片成功')
            console.log(response)
        }).catch(response => {
            console.log('图片上传失败')
      })
        },
      beforeAvatarUpload(file) {
        // // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 1;

        // // if (!isJPG) {
        // //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return  isLt2M;
      },
      submitUpload() {
        console.log(this.$refs.upload)
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        console.log(files)
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length } 个文件`);
      },
    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>