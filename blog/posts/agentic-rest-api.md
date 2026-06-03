It's a while loop. With raw API calls.

---

## So What Even Is Agentic?

Traditional LLM usage is dead simple. User types something. LLM reads it, generates a response, done. One shot. Stateless. You leave, it forgets you existed.

Agentic is what happens when you give the LLM tools instead of just expecting it to hallucinate its way to an answer. The LLM reasons about what to do, tells a tool to do it, reads the output, reasons again, and either calls another tool or finally responds. It loops.

```
user asks → LLM reasons → LLM calls tool → analyze output → reason → respond or loop
```

That's it. That's the whole architecture. I'm not gatekeeping anything. Everything else is just wrapper code around this.

---

## How Does Tool Calling Actually Work?

The LLM doesn't execute anything. It never touches your database. It doesn't make HTTP calls. It doesn't know your server even exists. It just returns a structured JSON blob that says "I want to call this function with these parameters."

```json
{
  "type": "tool_use",
  "id": "toolu_01ABC",
  "name": "get_inventory",
  "input": { "product_id": "SKU-001" }
}
```

Then **your application** reads that response, actually calls the function, gets the result, and sends everything back to the LLM in a new API call with the full context appended. The LLM has no persistent process running. It's not waiting. Every call is completely stateless.

So a 3-tool-call agentic interaction is actually 4 separate LLM API calls with a context window that grows each time. Something to think about when you're designing your "intelligent autonomous agent" and wondering why it costs so much per conversation.

Your application loop looks like this:

```python
messages = [{"role": "user", "content": user_input}]

while True:
    response = call_llm(messages, tools, system_prompt)

    if response.stop_reason == "tool_use":
        tool_call = extract_tool_call(response)
        result = execute_function(tool_call.name, tool_call.input)

        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_call.id,
                "content": result
            }]
        })
        continue
    else:
        return response.content
```

Parse the response. Tool call detected? Execute it, append context, loop. Final answer? Return it. That's your "agentic framework."

I spent two weeks convinced I was building something sophisticated. I was writing a while loop with an if-else inside it.

---

## How Does the LLM Know What Tools Exist?

Not through some service registry that boots up when your app starts. Not through dependency injection. Not through any pattern that would make a senior engineer nod approvingly.

You just... put the tool definitions in the request. Every single time.

```json
{
  "model": "claude-sonnet-4-6",
  "system": "You are a helpful assistant.",
  "tools": [
    {
      "name": "get_inventory",
      "description": "Get current inventory levels for products",
      "input_schema": {
        "type": "object",
        "properties": {
          "product_id": { "type": "string" }
        },
        "required": ["product_id"]
      }
    }
  ],
  "messages": [{ "role": "user", "content": "What's the stock for SKU-001?" }]
}
```

The LLM reads your tool definitions, decides which one is relevant, and picks it. No training update. No hot reload. You just describe what tools exist, every request, and the model figures it out.

This is either elegant or deeply inefficient depending on your mood.

---

## What About Infinite Loops?

Valid concern. If the LLM keeps reasoning in circles and calling tools that never converge on an answer, you're just burning tokens indefinitely while your bill climbs.

Add a max iterations counter:

```python
MAX_ITERATIONS = 10
iteration = 0

while iteration < MAX_ITERATIONS:
    response = call_llm(messages, tools, system_prompt)
    iteration += 1

    if response.stop_reason == "tool_use":
        # ... execute and loop
    else:
        return response.content

return "Agent exceeded maximum iterations. Something went wrong."
```

Hit the limit, break out, return an error or restart. The LLM is reasoning about context you fed it — if that context keeps sending it in circles, no amount of patience fixes it. Cap it and diagnose the prompt.

---

## Not Every Model Can Do This

Tool calling requires specific training. The model needs to:

- Output structured JSON with the exact right function name, exact right parameter names, correct types
- Know when it should call a tool versus when it should just answer
- Stop generating mid-response, emit a tool call, and resume reasoning when the result comes back
- Handle a context window that grows with every iteration without losing track of what it was doing

If the model wasn't fine-tuned for this pattern, it just outputs text that looks like JSON. Or worse, it outputs valid JSON describing a tool call that it just invented. You'll get a `KeyError` in production and spend an afternoon reading through logs wondering why your agent called a tool called `search_user_data` when no such tool exists.

Use models that explicitly support tool calling. This is not a setting you can toggle on.

---

## What About Having Too Many Tools?

Since you're sending tool definitions with every request, sending 30+ tools when the user is asking about inventory and 25 of them are billing or analytics tools wastes tokens. More importantly, it can actually confuse the model. More options means more surface area for the model to reason through before deciding — and reasoning costs tokens too.

A few approaches:

**Tool RAG** — embed all your tool descriptions as vectors. At request time, run cosine similarity against the user query, retrieve top-k relevant tools, send only those. Good for large tool libraries where usage patterns are relatively predictable.

**Static routing** — categorize tools by domain. Do a lightweight intent classification first, send only the relevant group. Less infrastructure than vector search, good enough for a lot of cases.

**Two-stage routing** — use a small cheap model to first decide which tools are relevant for this query, then send that filtered list to the main call. More accurate than static routing, cheaper than sending everything.

The tradeoff is always the same: filter too aggressively and the model can't reach a tool it actually needed. Better to send a few extras than to silently fail because you over-trimmed.

---

Every agentic framework out there — LangChain, LangGraph, CrewAI, LlamaIndex, whatever is popular this week — is doing this exact same loop underneath. And on top of that loop they've built everything you actually need for production: streaming, observability, retries, context management, agent coordination, tool registries. Real problems that take real engineering to solve well. Don't rewrite that in a weekend.

The thing is, you can't fully understand what the framework is doing without understanding why the pattern exists. And you can't appreciate why the pattern exists without seeing how the pieces actually fit together. The abstraction and the fundamentals are kind of inseparable that way — one without the other just looks like magic or boilerplate depending on which direction you're coming from.

The LLM is the brain. Your application code is the hands. Agentic isn't a different model. It's an architecture pattern you build around the model.

It's a while loop. With raw API calls. I said what I said.
