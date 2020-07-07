<template>
  <div class="container">
     
      
      <el-row style="text-align:right;">
              <yypt-button v-permission='"sysdictdtl:add"' permission='sysdictdtl:add' @click="click('新增字典值')"></yypt-button>
      </el-row>
         



      <el-table :data="datalist"
        ref="datatable"         
        row-key="id"
        height="40vh"
        style="margin-top:5px;"
        border
        stripe
        highlight-current-row
        v-loading="listLoading">

    
     

      <el-table-column  label="ID" width="70" align="center"> 
          <template slot-scope="scope">
                {{scope.row.dictDtlId}}
          </template>
      </el-table-column>
      
      <el-table-column  label="名称" width="200" align="center">
          <template slot-scope="scope">
                  {{scope.row.label}}
          </template>
      </el-table-column>



      <el-table-column  label="字典值" width="200" align="center">
          <template slot-scope="scope">
                  {{scope.row.value}}
          </template>
      </el-table-column>

      <el-table-column prop="orderNo" label="排序" width="90" align="center" show-overflow-tooltip="">
      </el-table-column>

      <el-table-column prop="memo" label="备注" width="90" align="center" show-overflow-tooltip="">
      </el-table-column>


      <el-table-column prop="createTime" label="创建日期" width="155" align="center">
      </el-table-column>


      <el-table-column prop="updateTime" label="更新日期" width="155" align="center">
      </el-table-column>


      <el-table-column prop="dictId" label="字典ID" width="90" align="center">

      </el-table-column>



      <el-table-column label="操作" :width="180"  align="center"  >
        <template slot-scope="scope" >
            <el-button class="buttongroup" v-permission='"dictdtl:edit"' type="text"  round icon="el-icon-edit"   @click="click('修改',scope)">修改</el-button>   
            <el-button  class="buttongroup"  v-permission='"dictdtl:delete"' type="text"  round icon="el-icon-delete"  @click="click('删除',scope)">删除</el-button>
        </template>
      </el-table-column> 

    </el-table>



    <el-pagination background :page-sizes="pagesizes" :current-page="currentPage" @size-change="handleSizeChange" :page-size="pageSize"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    <el-dialog :title="title" :visible.sync="dialogVisible"  :close-on-click-modal="false">
        <el-form :model="data" ref="dataForm"  :rules="rules" label-width="90px" size='small'>

          <el-row>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form-item prop="label" label="名称:">
                   <el-input v-model="data.label" placeholder="请输入选项名称"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form-item prop="value" label="字典值:">
                   <el-input v-model="data.value" placeholder="请输入字典值"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form-item prop="orderNo" label="排序:">
                   <el-input v-model="data.orderNo" placeholder="请输入排序号"></el-input>
                </el-form-item>
            </el-col>
            
          </el-row>




          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item prop="memo" label="备注:">
                   <el-input v-model="data.memo" placeholder="请输入字典备注"></el-input>
                </el-form-item>
            </el-col>
          </el-row>


          

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="dialogVisible = false" icon="el-icon-circle-close">取 消</el-button>
          <el-button :loading="saveing"  type="primary" icon="el-icon-circle-check" @click="handSave()">保存</el-button>
        </div> 
    </el-dialog>
    
  </div>
</template>

<script>
import { deepClone } from '@/utils'


const defaultData = {
    dictDtlId:null,
    dictId:null,
    label:null,
    value:null,
    memo:'',
    orderNo:null,
    createTime:null,
    updateTime:null
}

  export default {
    name:'sysdict-dtl',
    props:{
        masterdata:{
            type:Object
        }
    },
    components:{
      
    },
    data () {
      return {
          datalist:[],
          currentPage: 0,
          total: 0,
          pagesizes:[10, 20, 50, 100],
          pageSize:10,
          queryconditions:{},
          sortField:'',
          dialogVisible:false,
          data:Object.assign({},defaultData),
          rules:{
              label:[{required:true,message:'名称必须输入',trigger:'blur'}],
              value:[{required:true,message:'字典值必须输入',trigger:'blur'}],
           },
          title:'',
          saveing:false,
          action:'',
          rightCellWidth:10,
          listLoading:false
      };
    },
    created(){
      // this.fetchData()
      // this.rightCellWidth = this.$router.meta.buttonList
      this.rightCellWidth = this.$route.meta.buttons.filter( item => item.orderCode !== -1 ).length * 80
    },
    computed:{
       
    },
    mounted(){
    },
    destroyed(){
    },
    methods: {
      click(command, scope){
          if(command === '修改'){
             this.action = 'edit'
             this.data = deepClone(scope.row)
             this.title = `修改【${this.data.label}】`
             this.dialogVisible = true
             this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
             }) 
          }else if(command === '新增字典值'){
             this.action = 'add'
             this.data = Object.assign({},defaultData)
             this.title = "新增字典值"
             this.dialogVisible = true
             this.$nextTick(() => {
               this.data.dictId = this.masterdata.dictId
                this.$refs['dataForm'].clearValidate()
             }) 
          }else if(command === '删除'){
             this.data = deepClone(scope.row)
             this.delete(scope)
          }
      },
      handleSizeChange(val){
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.fetchData()
      },
      query(res){
          this.queryconditions = res
          this.currentPage = 0
          this.fetchData()
      },
      delete(scope){
        this.$confirm(`是否删除【${this.data.label}】`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await this.$api.post('sysdictdtl/delete',this.data)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // this.fetchData()
            this.datalist.splice(scope.$index,1)
          }).catch(err => {
            console.error(err)
          })
      },
      fetchData(){
        this.listLoading = true
        // console.error("总单数据为:"+JSON.stringify(this.masterdata))
        this.data.dictId = this.masterdata.dictDtlId
        this.queryconditions.dictId = this.masterdata.dictId
        const req = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          sortField: this.sortField,
          sortOrder: '',
          querylist: this.queryconditions
        }
        this.$api.post('sysdictdtl/list',req).then(resp =>{
            this.total = resp.total
            this.datalist = resp.records
            this.listLoading = false
            if(this.datalist.length > 0){
                this.$refs['datatable'].setCurrentRow(this.datalist[0])
            }
        })

      },
      handSave(){
        this.$refs['dataForm'].validate((valid) =>{
          if(valid){
              this.$api.post('sysdictdtl/save',this.data).then(resp =>{
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
                this.dialogVisible = false
                // this.fetchData()
                if(this.action === 'add'){
                   this.datalist.unshift(resp)
                }else if(this.action == 'edit'){
                   const index = this.datalist.findIndex(v => v.dictDtlId === resp.dictDtlId)
                   this.datalist.splice(index, 1, resp)
                }
              })
          }
        })
      }
    }

  }

</script>
<style lang='scss' scoped>
.container{
  padding: 10px;
}
.buttongroup{
  padding: 5px;
}

</style>