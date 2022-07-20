import styled from 'styled-components';
import React, { ReactElement, useLayoutEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Fade } from 'react-reveal';
type Props = {
  items: ReactElement[];
};
const responsive = {
  0: { items: 1 },
  960: { items: 2 },
  1280: { items: 3 },
};

const Wrapper = styled.div`
  width: 100%;

  li.alice-carousel__stage-item {
    width: max-content !important;
  }
  div.alice-carousel {
    display: grid;
    @media only screen and (min-width: 960px) {
      grid-template-columns: 5% 90% 5%;
    }
    @media only screen and (max-width: 959.95px) {
      grid-template-columns: 10% 80% 10%;
    }
    // @media only screen and (max-width: 599.95px) {
    //   grid-template-columns: 10% 80% 10%;
    // }
  }
  div.alice-carousel div:first-child {
    grid-area: 1/2/1/2;
  }

  div.alice-carousel__prev-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  [class$='btn'] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    div {
      border-radius: 50%;
      background-color: #e0e0e0;
      height: 30px;
      width: 30px;
      transition: 500ms;
      @media only screen and (min-width: 960px) {
      }
      @media only screen and (max-width: 959.95px) {
        display: none;
      }
      :hover {
        background-color: #cc3366;
        p {
          color: white;
        }
      }
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      color: #114c84;
      height: 30px;
      width: 30px;
      padding: 0px;
      text-align: center;
      transition: 500ms;
    }
  }
`;

export default function Carousel({ items }: Props) {
  useLayoutEffect(() => {
    setTimeout(() => {
      //trigger synthetic resize event to force carousel
      //to recalculate items width
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }, []);

  return (
    <Wrapper>
      <AliceCarousel
        autoWidth
        // autoHeight
        // infinite
        // disableButtonsControls={true}
        mouseTracking
        controlsStrategy="responsive"
        responsive={responsive}
        disableDotsControls={true}
        onResizeEvent={() => true}
        // onResized={resizing}
        items={items}
      />
    </Wrapper>
  );
}
