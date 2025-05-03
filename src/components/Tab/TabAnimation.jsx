import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TabsAnimation = (props) => {
  return (
    <TransitionGroup component="div">
      <CSSTransition
        classNames="TabsAnimation"
        appear={true}
        timeout={0}
        enter={false}
        exit={false}
      >
        {props.children}
      </CSSTransition>
    </TransitionGroup>
  );
}

export default TabsAnimation;