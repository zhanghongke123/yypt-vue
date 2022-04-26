<template>
  <div class="container">
     
      
      <el-row style="text-align:right;margin-top:8px;">
              <yypt-button v-permission='"dict:add"' permission='dict:add' @click="click('新增字典')"></yypt-button>
              <YyptQuery :querycols="querycols" @query="query" ref="yyptquery"></YyptQuery>
      </el-row>
         



      <el-table :data="datalist"
        ref="datatable"         
        style="margin-top:-15px;"
        row-key="id"
        height="30vh"
        border
        stripe
        highlight-current-row
        v-loading="listLoading" @current-change="rowchange">
    
     

      <el-table-column  label="字典ID" width="70" align="center"> 
          <template slot-scope="scope">
                {{scope.row.dictId}}
          </template>
      </el-table-column>
      
      <el-table-column  label="字典名称" width="200" align="center">
          <template slot-scope="scope">
                  {{scope.row.dictName}}
          </template>
      </el-table-column>


      <el-table-column prop="dictMemo" label="备注" width="90" align="center" show-overflow-tooltip="">
      </el-table-column>


      <el-table-column prop="createTime" label="创建日期" width="155" align="center">
      </el-table-column>


      <el-table-column prop="updateTime" label="更新日期" width="155" align="center">
      </el-table-column>


       <el-table-column  label="状态" width="83" align="center">
        <template slot-scope="scope">
              <el-tag effect="dark" :type="scope.row.dictStatus === 1?'success':'danger'" size="mini" >
                {{scope.row.dictStatus === 0 ?'停用':'启用'}}
              </el-tag>
        </template>
      </el-table-column>


      <el-table-column prop="dictType" label="字典类型" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.dictType | getValueText('dicttype')}}
          </template>        
      </el-table-column>

      <el-table-column label="操作" :width="180"  align="center"  >
        <template slot-scope="scope" >
            <el-button class="buttongroup" v-permission='"dict:edit"' type="text"  round icon="el-icon-edit"   @click="click('修改',scope)">修改</el-button>   
            <el-button  class="buttongroup"  v-permission='"dict:delete"' type="text"  round icon="el-icon-delete"  @click="click('删除',scope)">删除</el-button>
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
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item prop="dictName" label="字典名称:">
                   <el-input v-model="data.dictName" placeholder="请输入字典名称"></el-input>
                </el-form-item>
            </el-col>
            
          </el-row>





          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item prop="dictType" label="字典类型:">
                    <el-select  filterable clearable  v-model="data.dictType" >
                        <el-option
                          v-for="item in dicttype"
                          :key="'dictType'+item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item prop="dictStatus" label="是否启用:">
                    <el-switch
                      v-model="data.dictStatus"
                      :active-value="Number('1')"
                      :inactive-value="Number('0')">
                    </el-switch>
                </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item prop="dictMemo" label="备注:">
                   <el-input v-model="data.dictMemo" placeholder="请输入字典备注"></el-input>
                </el-form-item>
            </el-col>
          </el-row>


          

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="dialogVisible = false" icon="el-icon-circle-close">取 消</el-button>
          <el-button :loading="saveing"  type="primary" icon="el-icon-circle-check" @click="handMasterSave()">保存</el-button>
        </div> 
    </el-dialog>






    <sysdictDtl ref="dtl" :masterdata='data'></sysdictDtl>

    
  </div>
</template>

<script>
import YyptQuery from '@/components/YyptQuery'
import { deepClone } from '@/utils'
import sysdictDtl from './dtl'


const defaultData = {
    dictId:null,
    dictName:null,
    dictMemo:null,
    dictStatus:1,
    dictType:2,
    createTime:null,
    updateTime:null
}

  export default {
    name:'sysdict',
    components:{
      YyptQuery,
      sysdictDtl
    },
    data () {
      return {
          querycols:[
            {
                prop:"dictName",
                label:"字典名称",
                type:"input"
            },
            {
                prop:"dictType",
                label:"字典类型",
                type:"select",
                options:this.$dict.dicttype


            }
          ],
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
              dictName:[{required:true,message:'字典名称必须输入',trigger:'blur'}],
              dictType:[{required:true,message:'字典类型必须输入',trigger:'blur'}],
           },
          title:'',
          saveing:false,
          showUserRep:false,
          action:'',
          rightCellWidth:10
      };
    },
    created(){
      this.fetchData()
      // this.rightCellWidth = this.$router.meta.buttonList
      this.rightCellWidth = this.$route.meta.buttons.filter( item => item.orderCode !== -1 ).length * 80
    },
    computed:{
       dicttype(){
         return this.$dict.dicttype
       }
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
             this.title = `修改【${this.data.dictName}】`
             this.dialogVisible = true
             this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
             }) 
          }else if(command === '新增字典'){
             this.action = 'add'
             this.data = Object.assign({},defaultData)
             this.title = "新增字典"
             this.dialogVisible = true
             this.$nextTick(() => {
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
      rowchange(currentRow,oldCurrentRow){
          if(currentRow != null){
              this.data = deepClone(currentRow)
              this.$nextTick(()=>{
                this.$refs['dtl'].fetchData()
              })
          }
 
      },
      query(res){
          this.queryconditions = res
          this.currentPage = 0
          this.fetchData()
      },
      delete(scope){
        this.$confirm(`是否删除【${this.data.dictName}】`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await this.$api.post('sysdict/delete',this.data)
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
        const req = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          sortField: this.sortField,
          sortOrder: '',
          querylist: this.queryconditions
        }
        this.$api.post('sysdict/list',req).then(resp =>{
            this.total = resp.total
            this.datalist = resp.records
            this.listLoading = false
            if(this.datalist.length > 0){
                this.$refs['datatable'].setCurrentRow(this.datalist[0])
            }else{
                 this.$nextTick(()=>{
                    this.$refs['dtl'].datalist = []
                  })
            }

            this.$refs['yyptquery'].disable(false)
            this.$refs['yyptquery'].isquerying = false
        }).catch( e =>{
            this.$refs['yyptquery'].disable(false)
            this.$refs['yyptquery'].isquerying = false      
        })

      },
      handMasterSave(){
        this.$refs['dataForm'].validate((valid) =>{
          if(valid){
              this.$api.post('sysdict/save',this.data).then(resp =>{
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
                this.dialogVisible = false
                // this.fetchData()
                if(this.action === 'add'){
                   this.datalist.unshift(resp)
                }else if(this.action == 'edit'){
                   const index = this.datalist.findIndex(v => v.dictId === resp.dictId)
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