const container = document.getElementById('container');
const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

const go = (url) => {
  window.history.pushState('', '', url);
  window.dispatchEvent(new Event('popstate'))
};

const getParamValue = (url, param) => {
  return url.searchParams.get(param)
};

const renderListPosts = (data) => {
  container.innerHTML = `<h3>List of Posts</h3>`;;
  data.forEach((element) => {
    container.innerHTML += `<div><span onclick="go('?postId=${element.id}')">${element.id}. ${element.title}</span></div>`;
  });
};

const renderPost = (data) => {
  container.innerHTML = '<div>';
  container.innerHTML += `<h3>${data.title}</h3>`;
  container.innerHTML += `<p>${data.body}</p>`;
  container.innerHTML += `<span>Author: <a onclick="go('?userId=${data.userId}')">${data.userId}</a></span>`;
  container.innerHTML += '</div>';
  container.innerHTML += `<div style="text-align: center"><button onclick="go('index.html')">Return to List of Posts</button></div>`;
};

const renderPostsByUser = (data) => {
  container.innerHTML = `<h3>List of Posts written by User ${data[0].userId}</h3>`;
  data.forEach((element) => {
    container.innerHTML += '<div>';
    container.innerHTML += `<div><span onclick="go('?postId=${element.id}')">${element.id}. ${element.title}</span></div>`;
    container.innerHTML += '</div>';
  });
  container.innerHTML += `<div style="text-align: center"><button onclick="go('index.html')">Return to List of Posts</button></div>`;
};

const request = async (baseURL, url, method) => {
  const response = await fetch(baseURL+url);
  const data = await response.json();
  method(data);
};

const render = (location) => {
  let url = new URL(location);

  if(getParamValue(url, 'postId')) {
    return request(API_ENDPOINT, `/${getParamValue(url, 'postId')}`, renderPost);
  }

  if(getParamValue(url, 'userId')) {
    return request(API_ENDPOINT, `/?userId=${getParamValue(url, 'userId')}`, renderPostsByUser);
  }

  return request(API_ENDPOINT, '', renderListPosts);
};

window.onload = () => render(window.location);

window.onpopstate = () => {
  render(window.location);
};
