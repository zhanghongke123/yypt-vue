<template>
  <div class="app-container">

      
      <el-row style="text-align:right;margin-top:-15px;">
             <yypt-button v-permission='"job:add"' permission='job:add' @click="add">添加定时任务</yypt-button>

              <!-- <YyptQuery :querycols="querycols" @query="query"></YyptQuery> -->
      </el-row>



    <el-table :data="list"
        ref="datatable"         
        style="width: 100%;margin-top:5px;"
        row-key="id"
        height="80vh"
        border
        stripe
        highlight-current-row
        v-loading="listLoading" >
        <!-- @selection-change="handleSelectionChange" -->
        <el-table-column prop="jobName" width="120" show-overflow-tooltip align="center" label="定时任务名称">
        </el-table-column >

        
        <el-table-column prop="jobClassName" width="270" align="center"  label="类名">
        </el-table-column>


        <el-table-column prop="cronExpression" width="120"  align="center" label="cron表达式">
        </el-table-column>


        <el-table-column prop="startTime" width="160" align="center"  label="开始日期">
        <template slot-scope="scope">
                {{ formatDate(scope.row.startTime)}}
            </template>
        </el-table-column>


        <el-table-column prop="endTime" width="160" align="center"  label="结束日期">
        <template slot-scope="scope">
                {{ formatDate(scope.row.endTime)}}
            </template>
        </el-table-column>


        <el-table-column prop="prevFireTime" width="160" align="center" label="上次执行日期">
            <template slot-scope="scope">
                {{ formatDate(scope.row.prevFireTime)}}
            </template>
        </el-table-column>

    
        <el-table-column prop="nextFireTime" width="160" align="center"  label="下次执行日期">
            <template slot-scope="scope">
                {{ formatDate(scope.row.nextFireTime)}}
            </template>
        </el-table-column>

        <el-table-column prop="paramstr" width="140" align="center"  label="参数">
        </el-table-column>

        <el-table-column prop="description" width="200"  label="备注">
        </el-table-column>


        <el-table-column fixed prop="status" width="70" align="center"  label="状态">
           <template slot-scope="scope">
                <el-tag
                    :type="getTageType(scope.row.status)" size="small"
                    disable-transitions>{{scope.row.status | getStatuText}}
                </el-tag>
           </template>
        </el-table-column>

        <el-table-column fixed='right' width="300" align="center" label="操作">
            <template slot-scope="scope">
                <el-button class="buttongroup" v-permission='"job:edit"' type="text"  round icon="el-icon-edit"   @click="edit(scope.row)">修改</el-button>
                <el-button class="buttongroup"  v-permission='"job:start"' type="text"  round icon="el-icon-video-play" @click="resume(scope.row)">启动</el-button>
                <el-button class="buttongroup"  v-permission='"job:pause"' type="text"  round icon="el-icon-video-pause" @click="pause(scope.row)">停止</el-button>
                <el-button  class="buttongroup"  v-permission='"job:delete"' type="text"  round icon="el-icon-delete"  @click="remove(scope.row)">删除</el-button>
              </template>
        </el-table-column>
      </el-table>


    <el-dialog :visible.sync="dialogVisible" :title="isedit?'编辑任务':'新增任务'">
          <el-form :model="job" ref="jobForm" label-width="auto" size='small' label-position="left" >
            <el-form-item label="任务名称" prop="jobName" :rules="[{required: true, message: '任务名称不能为空',trigger: 'blur'}]">
              <el-input v-model="job.jobName" placeholder="任务名称" />
            </el-form-item>

             <el-form-item label="任务类名" prop="jobClassName" :rules="[{required: true, message: '任务类名不能为空',trigger: 'blur'}]">
              <el-input v-model="job.jobClassName" placeholder="任务类名" />
             </el-form-item>

            <el-form-item label="Cron时间表达式" prop="cronExpression" :rules="[{required: true, message: 'Cron时间表达式不能为空',trigger: 'blur'}]">
                <yypt-cron   @change="setCorn" v-model="job.cronExpression"></yypt-cron>
            </el-form-item>

            <!-- v-decorator="['cronExpression', { initialValue: '* * * * * ? *' }]" -->
            
            <el-form-item label="任务参数" prop="paramstr" >
              <el-input v-model="job.paramstr" placeholder="任务参数" />
            </el-form-item>
            
            <el-form-item label="任务描述" prop="description">
              <el-input v-model="job.description" placeholder="任务描述" />
            </el-form-item>
           
          </el-form>

        <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button :loading="saveing"  type="primary" @click="confirm()">保存</el-button>
        </div> 

		</el-dialog>
  </div>
</template>

<script>
 import {GetList,resume,remove,add,edit,pause } from '@/api/system/job'
 import {deepClone} from '@/utils/index'
 import { debounce } from '@/utils'
import YyptCron from "@/components/YyptCron";


   const defaultjob = {
         jobName:'',
         jobGroup:'',
         oldJobName:'',
         oldJobGroup:'',
         description:'',
         jobClassName:'',
         triggerName:'',
         triggerGroup:'',
         cronExpression:'* * * * * ? *',
         paramstr:''
    }

  export default {
    components:{
        YyptCron
    },
    data () {
      return {
          list:[],
          dialogVisible:false,
          isedit:false,
          job:Object.assign({},defaultjob),
          listLoading:false,
          showcron:false,
          saveing:false
      };
    },

    created(){
     this.getdata()
    },
    filters:{
       getStatuText(value){
          const dict = {
                '-1':'不存在',
                '0':'正常',
                '1':'暂停',
                '2':'完成',
                '3':'错误',
                '4':'阻塞'
                 }
           return dict[String(value)]
       }
    },
    methods: {
        add0(m){
            return m<10?'0'+m:m
        },
        formatDate(time){
           if(time == 0 || time == undefined){
              return "";
           }
           var d=new Date(time);
           var year=d.getFullYear(); 
           var month=d.getMonth()+1; 
           var date=d.getDate(); 
           var hour=d.getHours(); 
           var minute=d.getMinutes(); 
           var second=d.getSeconds(); 
           return year+"-"+this.add0(month)+"-"+this.add0(date)+" "+this.add0(hour)+":"+this.add0(minute)+":"+this.add0(second); 
        },
        getdata(){
            this.listLoading = true
            GetList().then(resp =>{
                  const data = resp
                  this.list = data
                  this.listLoading = false
              })
        },
        setCorn(cron){
            this.job.cronExpression = cron
        },
        getTageType(STATUS){
           if(STATUS === -1 || STATUS === 3){
             return "danger";
           }else if(STATUS == 1 || STATUS == 4){
             return "warning";
           }else{
               return "success";
           }
        },
        add(){
           this.dialogVisible = true;
           this.isedit = false;
           this.saveing = false;
           this.job = Object.assign({},defaultjob)
        },
        resume(rowdata){
           console.log(rowdata)
           resume(rowdata).then(resp =>{
             this.getdata()
              })
        },
        remove(rowdata){
            this.$confirm(`是否删除【${rowdata.jobName}】`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              await remove(rowdata)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getdata()
            }).catch(err => {
              console.error(err)
            })
        },
        edit(row){
           this.job = deepClone(row)
           this.isedit = true
           this.dialogVisible = true
           this.saveing = false
        },
        pause(row){
          pause(row).then(resp =>{
            this.$message({
                          dangerouslyUseHTMLString: true,
                          type: 'success',
                          message: `<strong> <i>${row.jobName}暂停成功 </i></strong>`
                        })
            this.getdata()
          })
        },
        getHeaderClass(){
            return "padding:5;background:rgba(48, 65, 86, 0.86);color:#fff;text-align:center";
        },
        confirm(){
          this.$refs['jobForm'].validate((vaild) => {
            if(vaild){
                this.saveing = true
                  if(this.isedit){
                      edit(this.job).then(resp =>{
                        this.$message({
                          dangerouslyUseHTMLString: true,
                          type: 'success',
                          message: `<strong> <i>${this.job.jobName}修改成功</strong>`
                        })
                        this.getdata()
                        this.saveing = false
                        this.dialogVisible = false
                      })
                      
                    }else{
                      add(this.job).then(resp =>{
                        this.$message({
                          dangerouslyUseHTMLString: true,
                          type: 'success',
                          message: `<strong> <i>${this.job.jobName}添加成功</strong>`
                        })
                        this.getdata()
                        this.saveing = false
                        this.dialogVisible = false
                      })
                    }
                
                }
          })

           
        }
    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
.app-container{
  height: 90vh;
}

.buttongroup{
  margin-left: -40px;
}


</style>