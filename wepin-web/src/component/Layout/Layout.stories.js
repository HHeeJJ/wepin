import Layout from './Layout';
import {BrowserRouter} from 'react-router-dom';

const content = (
    <div>
        <h1>Welcome to the content for testing scroll</h1>
        <ul>
            {[...new Array(10)].map((_, index) => (
                <li key={index}>one</li>
            ))}
        </ul>
    </div>
);

export default {
    title: 'Components/Layout',
    component: Layout,
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen'
    },
    decorators: [
        // Layout 컴포넌트에서 사용하는 네이게이션에서 router 사용중이므로 BrowserRouter 추가
		(Story) => (
			<BrowserRouter>
				<Story />
			</BrowserRouter>
		),
	],
};

export const Main = () => (
    <Layout main={true}>{content}</Layout>
);