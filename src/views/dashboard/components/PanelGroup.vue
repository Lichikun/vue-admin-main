//card盒子
<template>
    <el-row :gutter="40">
        <el-col :span="10">
            <el-card shadow="hover">
                <div  class="user-info">
                    <img class="user-img" :src="`https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg`" />
                    <ul style="font-size: large;">
                        <li style="margin-bottom: 20px;">admin</li>
                        <li >管理员</li>
                    </ul>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                AAAAA
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover">
                BBBBB
            </el-card>
        </el-col>
    </el-row>
</template>
<script>

export default {
  components: {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.el-card {
    height: 180px;
    min-width: 200px;
}
.user-info {
    display: flex;
    align-items: center;
    line-height: 18px;
    margin-bottom: 12px;
} 
.user-img {
    margin-left: 40px;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    margin-right: 40px;
}
</style>