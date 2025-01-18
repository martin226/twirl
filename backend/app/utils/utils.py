def process_pipeline(data):
    """Process the pipeline data and return counts"""
    try:
        nodes = data.get('nodes', [])
        connections = data.get('connections', [])
        print(nodes, connections)
        return {
            'status': 'success',
            'counts': {
                'nodes': len(nodes),
                'connections': len(connections)
            },
            'message': f'Received {len(nodes)} nodes and {len(connections)} connections'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }