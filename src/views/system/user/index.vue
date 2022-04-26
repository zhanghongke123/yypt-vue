<template>
 <div>
    <single-page :pageConfig="pageConfig" ref="singlePage" @action="action">
        <!-- <template #shCompanyName_default="data" >
             <span>{{data.column}}</span>
        </template> -->
    </single-page>

    <el-dialog :title="'重置'+user.userName+'的密码'" :visible.sync="showpassword" v-el-drag-dialog :close-on-click-modal="false">
      <el-form>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="新密码:">
                   <el-input v-model="newpass" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
      </el-form>  
      <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="showpassword = false">取 消</el-button>
          <el-button :loading="saveing"  type="primary" @click="handpassword()">确定</el-button>
      </div> 
    </el-dialog>
 </div>    
</template>

<script>
import SinglePage from '@/components/SinglePage'
import { deepClone } from '@/utils'
import { VXETable } from 'vxe-table'


export default {
    components:{
        SinglePage
    },
    created(){
        this.getConfig()
    },
    data () {
        return {
             pageConfig:{},
             showpassword:false,
             user:{},
             newpass:'',
             saveing:false
        }
    },
    methods:{
        getConfig(){
            this.pageConfig = require('./config.json')
        },
        action(code,rows){
            console.log(code)
            if(code === 'respassword'){
              if(rows.length <= 0){
                  VXETable.modal.message({ content: '请选择需要重置密码的数据', status: 'warning' })
                  return
              }

              if(rows.length > 1){
                  VXETable.modal.message({ content: '请选择1条数据进行重置', status: 'warning' })
                  return
              }

              this.user = rows[0]
              this.newpass = ''
              this.showpassword = true

            }
        },
        handpassword(){
            this.saveing = true
            let user = deepClone(this.user)
            user.deptId = this.user.deptId[this.user.deptId.length - 1]
            user.userPassword = this.newpass
            this.$api.post('sysuser/respassword',user).then(resp =>{
                this.saveing = false
                this.$message({
                    type:'success',
                    message:`重置密码(${this.newpass})成功`
                })
                this.showpassword = false
            }).catch(e =>{
            console.error(e)
                 this.saveing = false
            })

            this.$refs.singlePage.clearSelect()

        }

    }
    
}
</script>

<style>

</style>