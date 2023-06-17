<template>
  <div>
    <div slot="header" class="clearfix">
      <span>字典详情</span>
      <el-button
        class="filter-item"
        size="mini"
        style="float: right;padding: 4px 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <div v-if="dictName == '' ">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="true"  :visible.sync="dialogFormVisible" :title="dialogTitle" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="所属字典" prop="name">
            <el-input v-model="form.dictypeName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典标签">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogTitle==='create'?createData():updateData()">确认</el-button>
        </div>
      </el-dialog>
      
      <!--表格渲染-->
      <el-table ref="table" :data="list" highlight-current-row style="width: 100%;" @selection-change="">
        <el-table-column label="所属字典" >
          <template>
            {{dictName}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="useful" label="状态" >
          <template slot-scope="scope">
          <el-switch
          :active-value="1" :inactive-value="0"
            v-model="scope.row.useful"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="turnUseful(scope.row)"
          />
        </template>
        </el-table-column>
        <el-table-column  label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.$index, scope.row)"
          />
        </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"  />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import { mapGetters } from 'vuex'
const defaultForm = { id: null, label: null, value: null, dictSort: 999 }
import { addDic, deleteDic, updateDic, getDicList, getDicPage, updateDicUseful} from '@/api/apis/dic'

export default {
  components: { Pagination },
  computed: {
        ...mapGetters([
            'dictName',
            'dictId'
        ]),
    },
  data() {
    return {
      dialogTitle:"",
      dialogFormVisible:false,
      reflash:false,
      total:10,
      searchInput:'',
      form:{
        name:"",
        value:"",
        dictypeId:"",
        dictypeName:""
      },
      listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
      list:[],
      rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        dictSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      },
    }
  },
  watch: {
    //监测是否刷新
    reflash: function (newData, oldData) {
      const self = this;
      getDicPage({
        "pageNum":self.listQuery.page,
        "pageSize":self.listQuery.limit,
        "value":"dictype_id",
        "name":self.dictId
      })
        .then(function (res) {
          self.list = res.data.records;
          self.total = res.data.total
          self.reload();
          self.reflash = false;
        })
        .catch(function (error) {});
        this.$set(this.list,'dictName',this.dictName)
    },
    //监测字典类型名刷新
    dictName: function (newData, oldData) {
      let self = this
          getDicPage({
            "pageNum":self.listQuery.page,
            "pageSize":self.listQuery.limit,
              "value":"dictype_id",
              "name":self.dictId
          })
          .then(function(res){
              self.total = res.data.total
              self.list = res.data.records
              self.reflash = false
              self.reload()
          }).catch(function(error){
          })
    },
    listQuery: {
      handler () { //这是vue的规定写法，当你watch的值发生变化的时候，就会触发这个handler，这是vue内部帮你做的事情
        this.getDic()
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
      immediate: true //刷新加载  立马触发一次handler
    },
  },
  created(){
      //初始化数据
      this.getDic()
  },
  methods:{
    //新建字段
    handleCreate() {
        this.dialogTitle = 'create'
        this.dialogFormVisible = true
        this.form = Object.assign({}) // copy obj
        this.form.dictypeId = this.dictId
        this.form.dictypeName = this.dictName
    },
    //编辑字段
    handleEdit(row) {
      this.dialogTitle = 'Edit'
      this.dialogFormVisible = true
      this.form = Object.assign({}, row) // copy obj
      this.form.dictypeId = this.dictId
      this.form.dictypeName = this.dictName
    },
    //获取用户数据表
    getDic(){
      let self = this
        getDicPage({
          "pageNum":self.listQuery.page,
          "pageSize":self.listQuery.limit,
            "value":"dictype_id",
            "name":self.dictId
        })
        .then(function(res){
            self.total = res.data.total
            self.list = res.data.records
            self.reload()
        }).catch(function(error){
        })
    },
    //创建数据
    createData() {
      this.dialogFormVisible = false
      let self = this
      
      addDic({
        "name":self.form.name,
        "value":self.form.value,
        "dictypeId":self.form.dictypeId
      }).then(function(res){
        self.reflash = true
      }).catch(function(error){

      })
    },
    //修改数据
    updateData() {
      this.dialogFormVisible = false

      let self = this
      updateDictype({
        "name":self.form.name,
        "value":self.form.value,
      }).then(function(res){
        self.reflash = true
      }).catch(function(error){

      })
    },
    //行内删除
    handleDelete(index, row){
      let self = this
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
          deleteDic({
              "ids":row.id,
          }).then(function(res){
            self.reflash = true
          }).catch(function(error){
              console.log(error)
          })
      this.$message({
          type: 'success',
          message: '删除成功!'
      });
      }).catch(() => {
      this.$message({
          type: 'info',
          message: '已取消删除'
      });          
      });
    },
    //修改useful状态
    turnUseful(row) {
      updateDicUseful({
        id: row.id,
        flag: row.useful,
      })
      .then(function (res) {})
      .catch(function (error) {
        console.log(error);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  .my-code {
    position: relative;
    padding: 15px;
    line-height: 20px;
    border-left: 5px solid #ddd;
    color: #333;
    font-family: Courier New,serif;
    font-size: 12px;
}
</style>
