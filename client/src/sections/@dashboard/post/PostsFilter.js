import PropTypes from 'prop-types';
import axios from 'axios';

PostsFilter.propTypes = {
  postList: PropTypes.arrayOf(PropTypes.object),
  filterRuleOne: PropTypes.string,
  filterRuleTwo: PropTypes.string,
};

export async function PostsFilter(userId, filterRuleOne, filterRuleTwo) {
  const allPosts = await getData(userId, filterRuleTwo);
  if (filterRuleOne !== 'ALL') {
    const res = await filterData(allPosts, filterRuleOne);
    return res;
  }
  return allPosts;
}

async function getData(userId, filterRuleTwo) {
  const res = await axios.get(`/post/${filterRuleTwo}`, {
    params: {
      userId,
    },
  });
  return res.data.data;
}

async function filterData(data, filterRuleOne) {
  const res = data.filter((item) => item.type === filterRuleOne);
  return res;
}
