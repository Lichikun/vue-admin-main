<template>
  <div>
    <!-- <el-upload class="upload-demo" ref="upload" action="#" 
 :on-preview="handlePreview" :on-change="handleChange" :on-remove="handleRemove" 
 :file-list="fileList" :auto-upload="false" :on-success="handleSuccess" 
 :http-request="uploadFile"> 
 <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  
  </el-upload>
  <el-button size="small" type="success" @click="submitUpload()" >发布</el-button>  -->
    <el-button @click="a()"> test</el-button>
  </div>
</template>

<script>
import { getOrdersState } from "@/api/apis/orders";
import { uploadPet } from "@/api/apis/picUrl";
import { getAllOrders, getOneOrders } from "@/api/apis/orders";
import { addPicture } from "@/api/apis/picUrl";
import { Avatar } from "element-ui";
export default {
  data() {
    return {
      formData: "",
      fileList: [], // upload多文件数组
    };
  },
  methods: {
    uploadFile(file) {
      this.formData.append("file", file.file);
      console.log(this.formData);
    },
    // 点击按钮触发
    submitUpload() {
      console.log("upload");
      this.formData = new FormData();
      this.$refs.upload.submit();

      uploadPet(this.formData)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });

      this.$refs.upload.clearFiles();
    },
    a() {
      let self = this;
      getOrdersState({})
        .then(function (res) {
          console.log("ordersRes:" + res.data["0"]);
        })
        .catch(function (error) {});

      // getAllOrders({
      //   pageNum: 1,
      //   pageSize: 10,
      // })
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
  },
};
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
  border-color: #409eff;
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
