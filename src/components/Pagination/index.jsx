import React, { Component } from "react";
import { Button } from "reactstrap";
import _ from "lodash";
import './index.scss'

// props list
// metadata
// customContainerStyle
// onChangePage 


class Pagination extends Component {
  state = {
    pages: [],
    interval: 10,
    pageSize: 10,
  }

  componentDidMount = () => {
    this.updatePages();
    this.handleResize();

    window.addEventListener("resize", this.handleResize);

    return () => window.removeEventListener("resize", this.handleResize);
  };

  componentDidUpdate = (pp) => {
    if (this.props.metadata?.totalPages !== pp.metadata?.totalPages) {
      this.updatePages();
    }
  };

  handleResize = () => {
    if (window.innerWidth < 768) {
      this.setState({ interval: 5, pageSize: 5 });
    } else {
      this.setState({ interval: 10, pageSize: 10 });
    }
  };

  updatePages = () => {
    let tmp = [];
    if (this.props.metadata?.totalPages === 0) {
      tmp.push(1);
    } else {
      for (let i = 0; i < this.props.metadata?.totalPages; i++) {
        tmp.push(i + 1);
      }
    }
    this.setState({
      pages: tmp,
      interval: this.props.metadata?.totalPages > this.state.pageSize
        ? this.state.pageSize
        : this.props.metadata?.totalPages
    });
  };

  render = () => {
    return (
      <>
        {this.state.pages.length > 0 &&
          <div
            className="custom-pagination"
            style={{ marginTop: 40, ... this.props.customContainerStyle }}
          >
            <Button
              className="custom-pagination__button-prev"
              disabled={this.state.pages.length === 1}
              onClick={() => {
                const page = this.props.metadata.page - 1;
                if (page <= (this.state.interval - this.state.pageSize)) {
                  this.setState({ interval: this.state.interval - this.state.pageSize });
                }
                this.props.onChangePage(page);
              }}
            >
              Prev
            </Button>
            {this.state.interval > this.state.pageSize && (
              <Button
                onClick={() => {
                  let tmp = _.cloneDeep(this.state.interval);
                  this.setState({ interval: tmp - this.state.pageSize });
                }}
              >
                ...
              </Button>
            )}
            {this.state.pages.map((item) => {
              if ((item > this.state.interval - this.state.pageSize && item <= this.state.interval)) {
                return (
                  <Button
                    key={`Pagination-${item}`}
                    outline
                    className={`border-0 btn-transition ${item === this.props.metadata?.page ? 'selected' : ''}`}
                    onClick={() => this.props.onChangePage(item)}
                  >
                    {item}
                  </Button>
                );
              }
            })}
            {this.state.interval < this.props.metadata?.totalPages && (
              <Button
                onClick={() => {
                  let tmp = _.cloneDeep(this.state.interval);
                  this.setState({ interval: tmp + this.state.pageSize });
                }}
              >
                ...
              </Button>
            )}
            <Button
              className="custom-pagination__button-next"
              disabled={this.props.metadata?.page === this.props.metadata?.totalPages || this.state.pages.length === 1}
              onClick={() => {
                const page = this.props.metadata.page + 1;
                if (page > this.state.interval) {
                  this.setState({ interval: this.state.interval + this.state.pageSize });
                }
                this.props.onChangePage(page);
              }}
            >
              Next
            </Button>
          </div>
        }
      </>
    );
  };
}

export default Pagination;
