import { motion } from 'motion/react';

export default function FadeIn({children}){

    return(
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
         >
           {children}
      </motion.div>
    )

}