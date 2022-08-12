import React from 'react';
import { cn } from '../../utils/';

/**
 * Properties for a card component.
 */
type CardProps = {
    className?: string;
    children?: React.ReactNode;
    tabIndex?: number;
    blur?: boolean;
    border?: boolean;
};

/**
 * Definition of a card component,the main purpose of
 * which is to neatly display information. Can be both
 * interactive and static.
 *
 * @param className Custom classes to be applied to the element.
 * @param children Child elements to be rendered within the component.
 * @param tabIndex
 * @param border
 * @param blur Whether or not to apply a blur-effect.
 */

const Card = ({
                  className,
                  children,
                  tabIndex,
                  border = true,
                  blur = true,
              }: CardProps) => (
    <div
        className={cn(
            className,
            border && 'border border-white',
            blur && ' bg-base bg-opacity-70 backdrop-blur-lg firefox:bg-opacity-90',
            'rounded-3xl text-white',
        )}
        tabIndex={tabIndex}
    >
        {children}
    </div>
);

export default Card;
