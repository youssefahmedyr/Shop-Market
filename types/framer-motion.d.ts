import React from 'react';
import { MotionProps } from 'framer-motion';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'motion-div': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & MotionProps;
        }
    }
}
