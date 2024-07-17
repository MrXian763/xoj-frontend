<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="id" label="题目编号">
        <a-input
          v-model="searchParams.id"
          placeholder="请输入题目编号"
          style="min-width: 280px"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="title" label="题目名称" style="min-width: 280px">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="section" label="难度" style="max-width: 160px">
        <a-select
          v-model="searchParams.difficulty"
          placeholder="选择难度"
          allow-clear
        >
          <a-option :value="1">简单</a-option>
          <a-option :value="2">中等</a-option>
          <a-option :value="3">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 280px">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签"
          allow-clear
        />
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
      <template #difficulty="{ record }">
        <a-space wrap>
          <a-tag
            :color="
              record.difficulty === 3
                ? 'red'
                : record.difficulty === 2
                ? 'orange'
                : 'green'
            "
          >
            {{
              record.difficulty === 3
                ? "困难"
                : record.difficulty === 2
                ? "中等"
                : "简单"
            }}
          </a-tag>
        </a-space>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="gray"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptance="{ record }">
        {{
          `${
            record.subMitNum ? record.acceptedNum / record.subMitNum : "0"
          }% (${record.acceptedNum}/${record.subMitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-button type="primary" @click="toQuestionPage(record)"
          >做题
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
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
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
 */
const loadData = async () => {
  const res = await QuestionControllerService.listMyQuestionVoByPageUsingPost(
    searchParams.value
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
    title: "题目编号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "难度",
    slotName: "difficulty",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptance",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
  },
];
</script>

<style scoped>
#questionsView {
  max-width: 1380px;
  margin: 0 auto;
}
</style>
