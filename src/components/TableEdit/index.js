import Vue from 'vue'
import VXETable from 'vxe-table'

import EditEtlModal from './EditEtlModal.vue'

Vue.component(EditEtlModal.name, EditEtlModal)

// 创建一个弹窗渲染
VXETable.renderer.add('EditEtlModal', {
    autofocus: '.vxe-input--inner',
    renderEdit (h, renderOpts, params) {
        let pageConfig = require(`./${renderOpts.etlId}.json`)
      return [
        <edit-etl-modal params={ params } pageConfig={pageConfig}></edit-etl-modal>
      ]
    }
  })

VXETable.renderer.add('FormEditEtlModal', {
  // 项内容模板
  renderItemContent (h,renderOpts, params) {
    const { data, property } = params
    const { props, etlId, resultMap} = renderOpts
    let pageConfig = require(`./${etlId}.json`)
    pageConfig.resultMap = resultMap
    return [
      <edit-etl-modal params={ params } pageConfig={pageConfig}></edit-etl-modal>
    ]
  }
})
