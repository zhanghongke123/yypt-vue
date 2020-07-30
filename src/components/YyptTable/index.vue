<template>
  <div> 
      <el-row style="padding:5px;" type="flex"  justify="space-between" v-if="querycolumn">
              <el-col :span="5">
                 <slot name="topButton">
                 </slot>
              </el-col>
              <el-col :span="19" >
                  <YyptQuery ref="yyptquery" :querycols="querycolumn" @query="query"  @reset='resetQueryForm'></YyptQuery>
              </el-col>
      </el-row>

      <el-row v-if="datacolumn">

       <el-table  ref="table"  v-loading="listLoading" height="50vh" stripe
        :data="data" 
        @cell-dblclick="dblclick" 
        @selection-change="handleSelectionChange" 
        @current-change="rowchange" border highlight-current-row >
          <el-table-column v-if="multiselect" type="selection" width="55"></el-table-column>
          <el-table-column v-for="col in datacolumn" :key="col.prop"  :width="col.width"
               :fixed="col.fixed === null ? 'false':col.fixed "
               align="center" :label="col.label" >
              <template slot-scope="scope">
                <slot :name="col.prop" :scope="scope">
                    <span v-if="col.iscombox">{{ getcomboxvalue(col.comboxvalue, scope.row[col.prop]) }}</span>
                    <span v-else> {{  scope.row[col.prop] }}</span>
                </slot>
              </template>
          </el-table-column>
        </el-table>

      </el-row>




    <div style="text-align:center;" v-if="showbottom">
        <el-button type="primary" size="small"  @click="confirm()">确认已选</el-button>
        <el-button  size="small"  @click="cancel()">取消</el-button>
    </div>

    <el-pagination background :page-sizes="pagesizes" :current-page="currentPage" @size-change="handleSizeChange" :page-size="pageSize"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
  </div>
</template>

<script>
import YyptQuery from '@/components/YyptQuery'


  export default {
    name:'YyptTable',
    props:['queryRoleId','pageconfig'],
    components:{
        YyptQuery
    },
    data () {
      return {
         listLoading: false,
         data:[],
         queryconditions:{},
         currentPage: 0,
         total: 0,
         pagesizes:[20, 40, 100],
         pageSize:20,
         sortField: "userId",
         sortOrder: "desc",
         selectrows: [],
         currenRow:{}
      };
    },
    computed:{
      multiselect(){
        return this.pageconfig.multiselect
      },
      querycolumn(){
        return this.pageconfig.querycolumn
      },
      datacolumn(){
        return this.pageconfig.datacolumn
      },
      showbottom(){
        return this.pageconfig.showbottom
      },
      queryurl(){
        return this.pageconfig.queryurl
      },
      config(){
        return this.pageconfig
      }
    },
    methods:{
        getcomboxvalue(item, value){
          return item[String(value)]
        },
        rowchange(currenRow, oldRow){
            this.currenRow = currenRow
        },
        handleSizeChange(val){
          this.pageSize = val
          this.fetchData()
        },
        handleCurrentChange(val){
          this.currentPage = val
          this.fetchData()
        },
        async fetchData(){
          this.listLoading = true
          this.queryconditions.queryRoleId = this.queryRoleId
          const req = {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            querylist: this.queryconditions
          }
          await this.$api.post(this.queryurl,req).then( data =>{
              this.data = data.records
              this.total = data.total
              this.listLoading = false
            if(this.data.length > 0){
                this.$refs['table'].setCurrentRow(this.data[0])
            }
          }).catch(err =>{
              console.log(err)
          })
      },
      async query(res){

          this.$refs['yyptquery'].disable(true)
          this.queryconditions = res
          this.currentPage = 0
          await this.fetchData()
          this.querycolumn.forEach(item =>{
                item.isdisabled = false
          })
          this.$refs['yyptquery'].disable(false)
          this.$refs['yyptquery'].isquerying = false


      },
      resetQueryForm(){
        this.queryconditions = {}
      },
      dblclick(row){
         this.$refs['table'].toggleRowSelection(row);  
      },
      handleSelectionChange(val){
        this.selectrows = val
      },
      confirm(){
        if(this.multiselect){
          //支持多选的话
          
        }else{
          //当前行
          this.selectrows = [this.currenRow]
        }
        this.$emit('ok', this.selectrows)

      },
      cancel(){
        this.$emit('cancel')
      }
    },
    created(){
      this.fetchData()
    }

  }

</script>
<style lang='' scoped>

</style>