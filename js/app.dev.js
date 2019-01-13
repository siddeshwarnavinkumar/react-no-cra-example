const { Component, Fragment } = React
const { HashRouter, Route, Link } = ReactRouterDOM;

const PostCard = props => (
  <Link className="post" to={`/post/${props.id}`}>
    <a href="javascript:void(0)">{props.title}</a>
    <p>{props.body}</p>
  </Link>
)

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      posts: []
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })

    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const posts = await res.json();
    this.setState({
      posts: posts,
      loading: false
    })
  }

  scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  prvPage() {
    if(!(this.state.page - 1 <= 0)) {
      this.setState(prvState => ({
        page: prvState.page - 1
      }))
    }

    this.scrollToTop();
  }

  nextPage() {
    if(this.state.page + 1 !== this.state.posts.length / 10) {
      this.setState(prvState => ({
        page: prvState.page + 1
      }))
    }

    this.scrollToTop();
  }

  render() {
    const currentPagePosts = [...this.state.posts].splice((this.state.page - 1) * 10, 10)
    const posts = currentPagePosts.map(post => (
      <PostCard
        id={post.id}
        key={post.id}
        title={post.title}
        body={post.body}
      />
    ))

    return (
      <div>
        <h1>Posts</h1>
        {this.state.loading ? (
          <p>Fetching posts...</p>
        ) : posts}

        <div className="pagination">
          <div>
            <button onClick={this.prvPage.bind(this)}>&lt; Previous</button>
          </div>

          <div>
            <p>{this.state.page}/{this.state.posts.length}</p>
          </div>

          <div>
            <button onClick={this.nextPage.bind(this)}>Next &gt;</button>
          </div>
        </div>
      </div>
    )
  }
}

class ViewPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      post: {}
    }
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${this.props.match.params.id}`)
    const post = await res.json();

    if(Object.keys(post).length > 0) {
      this.setState({
        loading: false,
        post: post
      });
    } else {
      this.props.history.go('/')
    }
  }

  render() {
    return (
      <Fragment>
        {
          !this.state.loading ? (
            <div>
              <h1>{this.state.post.title}</h1>
              <p>{this.state.post.body}</p>

              <Link to="/">&lt; Back to home</Link>
            </div>
          ) : (
            <p>Loading post...</p>
          )
        }
      </Fragment>
    )
  }
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Fragment>
          <Route exact path="/" component={Posts} />
          <Route exact path="/post/:id" component={ViewPost} />
        </Fragment>
      </HashRouter>
    )
  }
}

const postDOM = document.querySelector('#posts');
ReactDOM.render(<App />, postDOM);
