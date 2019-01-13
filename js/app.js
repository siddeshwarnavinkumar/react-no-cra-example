const {
  Component,
  Fragment
} = React;
const {
  HashRouter,
  Route,
  Link
} = ReactRouterDOM;

const PostCard = props => React.createElement(Link, {
  className: "post",
  to: `/post/${props.id}`
}, React.createElement("a", {
  href: "javascript:void(0)"
}, props.title), React.createElement("p", null, props.body));

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      posts: []
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
    this.setState({
      posts: posts,
      loading: false
    });
  }

  scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  prvPage() {
    if (!(this.state.page - 1 <= 0)) {
      this.setState(prvState => ({
        page: prvState.page - 1
      }));
    }

    this.scrollToTop();
  }

  nextPage() {
    if (this.state.page + 1 !== this.state.posts.length / 10) {
      this.setState(prvState => ({
        page: prvState.page + 1
      }));
    }

    this.scrollToTop();
  }

  render() {
    const currentPagePosts = [...this.state.posts].splice((this.state.page - 1) * 10, 10);
    const posts = currentPagePosts.map(post => React.createElement(PostCard, {
      id: post.id,
      key: post.id,
      title: post.title,
      body: post.body
    }));
    return React.createElement("div", null, React.createElement("h1", null, "Posts"), this.state.loading ? React.createElement("p", null, "Fetching posts...") : posts, React.createElement("div", {
      className: "pagination"
    }, React.createElement("div", null, React.createElement("button", {
      onClick: this.prvPage.bind(this)
    }, "< Previous")), React.createElement("div", null, React.createElement("p", null, this.state.page, "/", this.state.posts.length)), React.createElement("div", null, React.createElement("button", {
      onClick: this.nextPage.bind(this)
    }, "Next >"))));
  }

}

class ViewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      post: {}
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${this.props.match.params.id}`);
    const post = await res.json();

    if (Object.keys(post).length > 0) {
      this.setState({
        loading: false,
        post: post
      });
    } else {
      this.props.history.go('/');
    }
  }

  render() {
    return React.createElement(Fragment, null, !this.state.loading ? React.createElement("div", null, React.createElement("h1", null, this.state.post.title), React.createElement("p", null, this.state.post.body), React.createElement(Link, {
      to: "/"
    }, "< Back to home")) : React.createElement("p", null, "Loading post..."));
  }

}

class App extends Component {
  render() {
    return React.createElement(HashRouter, null, React.createElement(Fragment, null, React.createElement(Route, {
      exact: true,
      path: "/",
      component: Posts
    }), React.createElement(Route, {
      exact: true,
      path: "/post/:id",
      component: ViewPost
    })));
  }

}

const postDOM = document.querySelector('#posts');
ReactDOM.render(React.createElement(App, null), postDOM);
