import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import MetricsStore from 'stores/metrics/MetricsStore';
import NodesStore from 'stores/nodes/NodesStore';


import { PageHeader, Spinner } from 'components/common';
import { MetricsComponent } from 'components/metrics';

const ShowMetricsPage = React.createClass({
  propTypes: {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore), Reflux.connect(NodesStore)],
  render() {
    if (!this.state.nodes || !this.state.metricsNames) {
      return <Spinner />;
    }

    let nodeId = this.props.params.nodeId;
    // "master" node ID is a placeholder for master node, get first master node ID
    if (nodeId === 'master') {
      const nodeIDs = Object.keys(this.state.nodes);
      const masterNodes = nodeIDs.filter(nodeID => this.state.nodes[nodeID].is_master);
      nodeId = masterNodes[0] || nodeIDs[0];
    }

    const node = this.state.nodes[nodeId];
    const namespace = MetricsStore.namespace;
    const names = this.state.metricsNames[nodeId];
    const filter = this.props.location.query.filter;
    return (
      <span>
        <PageHeader title={'Metrics of ' + node.short_node_id}>
          <span>
            All Graylog nodes provide a set of internal metrics for diagnosis, debugging and monitoring. Note that you can access
            all metrics via JMX, too.
          </span>
          <span>This node is reporting a total of {names.length} metrics.</span>
        </PageHeader>

        <MetricsComponent names={names} namespace={namespace} nodeId={nodeId} filter={filter} />
      </span>
    );
  },
});

export default ShowMetricsPage;
