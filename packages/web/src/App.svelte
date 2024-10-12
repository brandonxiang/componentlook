<script>
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { CircleAlert } from "lucide-svelte";
	import CodeMirror from "svelte-codemirror-editor";
	import { javascript } from "@codemirror/lang-javascript";
  import { demoCodeMap } from "./demo-code";
	import { componentScanner } from 'componentlook/slim';
	import ts from 'typescript';

	let infoContent = $state("Please input your code here, and then click the 'Scan' button to scan the components.");
	let editorContent = $state("// Start coding here");

	const options = [
		{ value: 'vueOptionStyle', label: "Vue Option Style", code: demoCodeMap.vueOptionStyle },
		{ value: "vueCompositionStyle", label: "Vue Composition Style", code: demoCodeMap.vueCompositionStyle },
		{ value: "vueClassStyle", label: "Vue Class Style", code: demoCodeMap.vueClassStyle },
		{ value: "vueJsxStyle", label: "Vue Jsx Style", code: demoCodeMap.vueJsxStyle },
		{ value: "reactClassStyle", label: "React Class Style", code: demoCodeMap.reactClassStyle },
		{ value: "reactFunctionStyle", label: "React Function Style", code: demoCodeMap.reactFunctionStyle },
	];

	function getLanguageExtension(lang) {
		return javascript();
	}

	function handleLanguageChange(item) {
		editorContent = options.find((option) => option.value === item.value).code;
	}

	function analyzeCode() {
		const sourceFile = ts.createSourceFile('MyComponent.tsx', editorContent, ts.ScriptTarget.Latest, true);
		infoContent = componentScanner(sourceFile);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-3xl font-bold mb-6">Componentlook Playground</h1>

	<div class="mb-4">
		<Select onSelectedChange={handleLanguageChange}>
			<SelectTrigger class="w-[250px]">
				<SelectValue placeholder="Select language" />
			</SelectTrigger>
			<SelectContent>
				{#each options as option}
					<SelectItem value={option.value}>{option.label}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="w-full">
			<CodeMirror
				bind:value={editorContent}
				lang={getLanguageExtension("javascript")}
				class="bg-card text-card-foreground rounded-lg border shadow-sm"
				styles={{
					"&": {
						height: "400px",
						resize: "vertical",
						overflow: "auto",
					},
				}}
			/>
		</div>
		<div class="w-full">
			<Card>
				<CardHeader>
					<CardTitle>Detect Result</CardTitle>
					<CardDescription>Detected by <a href="https://github.com/brandonxiang/componentlook">Componentlook Github</a></CardDescription>
				</CardHeader>
				<CardContent>
					<p>{infoContent}</p>
				</CardContent>
			</Card>
			<div class="mt-4">
				<Button class="w-full" onclick={analyzeCode}>
					<CircleAlert class="mr-2 h-4 w-4" />
					Scan
				</Button>
			</div>
		</div>
	</div>
</div>