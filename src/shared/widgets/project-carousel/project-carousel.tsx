import "./project-carousel.css";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/shared/lib/cn";
import { DotButton } from "./project-carousel-dot-buttons";
import { NextButton, PrevButton } from "./project-carousel-next-buttons";
import { useDotButton, usePrevNextButtons } from "./hooks";
import { UrlSlide } from "./url-slide";
import { FileSlide } from "./file-slide";

type CarouselImage =
  | {
      type: "url";
      value: string;
    }
  | {
      type: "file";
      value: File;
    };

type BaseProps = {
  className?: string;
  children?: React.ReactNode;
  showControls: boolean;
};

type ProjectCarouselProps = BaseProps & {
  images: CarouselImage[];
  onDeleteImage?: (index: number) => void;
  onSetMainImage?: (index: number) => void;
};

export function ProjectCarousel(props: ProjectCarouselProps) {
  const { images, children, className, showControls } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel();
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className={cn("embla", className)}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {children}

          {images?.map((image, index) =>
          image.type === "file" ? (
            <FileSlide
              key={`file-${index}`}
              file={image.value}
              index={index}
              onDeleteImage={props.onDeleteImage ?? (() => {})}
              onSetMainImage={props.onSetMainImage ?? (() => {})}
            />
          ) : (
            <UrlSlide
              key={`url-${index}`}
              url={image.value}
              index={index}
              onDeleteImage={props.onDeleteImage ?? (() => {})}
              onSetMainImage={props.onSetMainImage ?? (() => {})}
            />
          )
        )}
        </div>
      </div>

      {showControls && (
        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={cn("embla__dot", {
                  "embla__dot--selected": index === selectedIndex,
                })}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
