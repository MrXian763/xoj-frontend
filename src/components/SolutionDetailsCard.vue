<template>
  <div>
    <a-comment
      v-for="item in solutionDetails"
      v-bind:key="item.userId"
      :author="item.userNickName"
      :datetime="item.publishTime.toString()"
      align="right"
    >
      <template #actions>
        <span key="heart" class="action" @click="onLikeChange(item)">
          <span v-if="item.isLike">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ item.likesCount }}
        </span>
        <span key="star" class="action" @click="onStarChange(item)">
          <span v-if="item.isFavorite">
            <IconStarFill
              style="
                 {
                  color: '#ffb400';
                }
              "
            />
          </span>
          <span v-else>
            <IconStar />
          </span>
          {{ item.favoritesCount }}
        </span>
        <span key="reply" class="action" @click="showDetails(item)">
          <IconMessage /> {{ item.commentsCount }}
        </span>
        <a-button type="text" @click="showDetails(item)">查看</a-button>
      </template>
      <template #avatar>
        <a-avatar>
          <img :src="item.userAvatarUrl" alt="avatar" />
        </a-avatar>
      </template>
      <template #content>
        <div>{{ item.content }}</div>
      </template>
    </a-comment>
    <template v-if="nullSolutionDetails">
      <a-empty />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  IconHeart,
  IconMessage,
  IconStar,
  IconStarFill,
  IconHeartFill,
} from "@arco-design/web-vue/es/icon";
import myAxios from "@/plugins/axios";
import message from "@arco-design/web-vue/es/message";
import { withDefaults, defineProps } from "vue";
import { SolutionDetails } from "../../generated/models/SolutionDetails";

const solutionDetails = ref<SolutionDetails[]>([]);

const nullSolutionDetails = ref(false);

/**
 * 更改点赞数
 */
const onLikeChange = async (item: SolutionDetails) => {
  item.isLike = !item.isLike;
  item.likesCount = item.likesCount + (item.isLike ? 1 : -1);
  const res = await myAxios.get(
    "/question/solution-details/like-count/update",
    {
      params: {
        id: item.id,
        isLike: item.isLike,
      },
    }
  );
  if (res.status == 200) {
    message.success("操作成功");
  } else {
    item.isLike = !item.isLike;
    item.likesCount = item.likesCount + (item.isLike ? 1 : -1);
    message.error("操作失败" + res.message);
  }
};

/**
 * 更改收藏数
 * @param item 题解数据
 */
const onStarChange = async (item: SolutionDetails) => {
  item.isFavorite = !item.isFavorite;
  item.favoritesCount = item.favoritesCount + (item.isFavorite ? 1 : -1);
  const res = await myAxios.get(
    "/question/solution-details/favorite-count/update",
    {
      params: {
        id: item.id,
        isFavorite: item.isFavorite,
      },
    }
  );
  if (res.status == 200) {
    message.success("操作成功");
  } else {
    item.isFavorite = !item.isFavorite;
    item.favoritesCount = item.favoritesCount + (item.favoritesCount ? 1 : -1);
    message.error("操作失败" + res.message);
  }
};

/**
 * 查看题解详情
 * @param item 题解数据
 */
const showDetails = (item: SolutionDetails) => {
  alert("查看题解详情");
};

/**
 * 定义组件属性类型
 */
interface Props {
  questionId: number;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  questionId: 0,
});

watch(
  () => props.questionId,
  async () => {
    await loadData();
  }
);

/**
 * 加载当前题目的题解列表
 */
const loadData = async () => {
  const res = await myAxios.get("/question/solution-details/list/problemId", {
    params: {
      problemId: props.questionId,
    },
  });
  if (res.status == 200) {
    solutionDetails.value = res.data.data;
    if (solutionDetails.value.length == 0) {
      nullSolutionDetails.value = true;
    }
  } else {
    message.error("加载题解数据失败" + res.message);
  }
};
</script>

<style scoped>
.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>
