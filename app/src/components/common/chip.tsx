import Text from '../common/text';
import { cn } from 'utils';
import { IconType } from 'react-icons';
import React from 'react';
import { MdContentCopy, MdDone } from 'react-icons/md';

/**
 * Properties for a card component.
 */
type ChipProps = {
    className?: string;
    highlightValue?: string;
    value?: string;
    copyValue?: string;
    icon?: IconType;
    children?: React.ReactNode;
    reversed?: boolean;
    href?: string;
};

/**
 * Definition of a card component,the main purpose of
 * which is to neatly display information. Can be both
 * interactive and static.
 *
 * @param className Custom classes to be applied to the element.
 * @param children Child elements to be rendered within the component.
 * @param blur Whether or not to apply a blur-effect.
 */
const Chip = ({ className, highlightValue, value, copyValue, icon, children, reversed, href}: ChipProps) => {
    const [showTooltip, setShowTooltip] = React.useState(false)

    return (
        <div
            className={cn(
                (href || copyValue) && "cursor-pointer hover:bg-black/30 transition-colors",
                "flex flex-row items-center gap-2.5 w-fit text-secondary rounded-full bg-black/50 px-2 py-1",
            )}
            onClick={() => {
                if (copyValue) {
                    navigator.clipboard.writeText(copyValue).then();
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 2000);
                }
            }}
        >
            { copyValue ? (
                <>
                    <Text variant="label"> Copy </Text>
                    <label className={cn("swap swap-rotate", showTooltip && "swap-active")}>
                        <MdContentCopy size={13} className="swap-off text-secondary" />
                        <MdDone size={13} className="swap-on text-success" />
                    </label>
                </>
            ) : (
                <>
                    <Text
                        variant="label"
                        className={cn(
                            className,
                            'flex flex-row items-center gap-1',
                            reversed && 'flex-row-reverse',
                        )}
                        href={href}
                    >
                        {highlightValue && (
                            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-primary">
                                {highlightValue}
                            </span>
                        )}
                        {(value) && (
                            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                                {value}
                            </span>
                        )}
                    </Text>
                    { icon && React.createElement(icon, { size: 13 }) }
                    { children}
                </>
            )}
        </div>
    );
};

export default Chip;
