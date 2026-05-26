/*
 * Simple counter to verify React hydration works in blog posts.
 * Delete this once real interactive components exist.
 */
import { useState } from 'react';

export function Counter() {
	const [count, setCount] = useState(0);
	return (
		<button
			onClick={() => setCount(count + 1)}
			style={{
				background: '#00838f',
				color: '#fff',
				border: 'none',
				borderRadius: '6px',
				padding: '0.6rem 1.4rem',
				fontSize: '1rem',
				fontWeight: 600,
				cursor: 'pointer',
			}}
		>
			Clicked {count} {count === 1 ? 'time' : 'times'}
		</button>
	);
}
