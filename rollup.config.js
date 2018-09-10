import uglify from "rollup-plugin-uglify-es";
import minify from 'rollup-plugin-minify-es';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


const isDebug = process.env.NODE_ENV == "debug";

export default {
    plugins: [isDebug||uglify(),isDebug||minify(), resolve(), commonjs({
        include: 'node_modules/**'
    })]
}