<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="id" label="题目编号">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目编号"
          style="min-width: 280px"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="编程语言">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '160px' }"
          placeholder="编程语言"
          :trigger-props="{ autoFitPopupMinWidth: true }"
        >
          <a-option>java</a-option>
          <a-option>c</a-option>
          <a-option>cpp</a-option>
          <a-option>python</a-option>
          <a-option>go</a-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-button type="primary" @click="toQuestionPage(record)"
          >查看
        </a-button>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

onMounted(async () => {
  await loadData();
});

/**
 * 改变页码
 * @param current 当前页码
 */
const onPageChange = (current: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: current,
  };
};

/**
 * 加载数据
 * 根据创建时间降序
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败" + res.message);
  }
};

/**
 * 监听搜索参数变化，参数变化触发重新加载数据
 */
watchEffect(async () => {
  await loadData();
});

/**
 * 跳转到做题页面
 * @param record 当前题目数据
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 根据条件搜索题目
 */
const doSearch = () => {
  searchParams.value = {
    // 将当前页码重置为第一页
    ...searchParams.value,
    current: 1,
  };
};

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题目编号",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];
</script>

<style scoped>
#questionSubmitView {
  max-width: 1480px;
  margin: 0 auto;
}
</style>
